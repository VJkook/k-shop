<?php

namespace App\Repositories;

use App\Models\BasicDate;
use App\Models\BasicIntervalTime;
use App\Models\Confectioner;
use App\Models\ConfectionersBusyTime;
use App\Models\Responses\Users\ConfectionerResponse;
use App\Models\Responses\Users\ConfectionersCalendarResponse;
use App\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class ConfectionerRepository
{
    /**
     * @return User[]
     */
    public function all(): array
    {
        $users = $this->getConfectioners();
        $responses = [];
        foreach ($users as $user) {
            $responses[] = $user->toUserResponse();
        }

        return $responses;
    }

    public function getAvailableByDate(BasicDate $date): array
    {
        $users = $this->getConfectioners();
        $responses = [];
        foreach ($users as $user) {
            /** @var ConfectionersBusyTime $confectionerBusyTime */
            $confectionerBusyTime = $user->busyTime()
                ->where('work_date', $date->toStringYearDayMonth())
                ->first();

            if (!is_null($confectionerBusyTime)) {
                $basicDate = BasicIntervalTime::fromIntervalString($confectionerBusyTime->busy_time);
                if ($basicDate->gte($this->getMaxTime())) {
                    continue;
                }
            }

            $responses[] = $user->toUserResponse();
        }

        return $responses;
    }

    public function getConfectionersCalendar(BasicDate $from, BasicDate $to): ConfectionersCalendarResponse
    {
        $confectioners = Confectioner::query()
            ->with('busyTime', function (HasMany $query) use ($from, $to) {
                $query->whereBetween('work_date', [$from, $to]);
            })
            ->get();

        $confectionerCalendar = new ConfectionersCalendarResponse();
        /** @var Confectioner $confectioner */
        foreach ($confectioners as $confectioner) {
            $busyTimes = $confectioner->busyTime;

            /** @var ConfectionersBusyTime $busyTime */
            foreach ($busyTimes as $busyTime) {
                $basicTime = BasicIntervalTime::fromIntervalString($busyTime->busy_time);
                $basicDate = BasicDate::fromYearMonthDayString($busyTime->work_date);
                $confectionerBusyTimeResponse = $confectioner->toConfectionerBusyResponse($basicTime);
                $confectionerCalendar->addConfectionerToDate($basicDate, $confectionerBusyTimeResponse);
            }
        }

        return $confectionerCalendar;
    }

    private function getMaxTime(): BasicIntervalTime
    {
        $maxBusyTimeRepo = new MaxTimeForCookingRepository();
        return $maxBusyTimeRepo->getMax();
    }

    /**
     * @throws Exception
     */
    public function getBusyTime(int $confectionerId, BasicDate $workDate): BasicIntervalTime
    {
        /** @var Confectioner $confectioner */
        $confectioner = $this->getConfectionerById($confectionerId);
        if (is_null($confectioner)) {
            return new BasicIntervalTime(0);
        }

        /** @var ConfectionersBusyTime $confectionersBusyTime */
        $confectionersBusyTime = $confectioner->busyTime()->where('work_date', $workDate->toStringYearDayMonth())->first();

        if (is_null($confectionersBusyTime)) {
            return new BasicIntervalTime(0);
        }

        return BasicIntervalTime::fromCarbonInterval($confectionersBusyTime->busy_time);
    }

    /**
     * @throws Exception
     */
    public function addBusyTime(int $confectionerId, BasicDate $workDate, BasicIntervalTime $busyTime): ?ConfectionersBusyTime
    {
        $confectioner = $this->getConfectionerById($confectionerId);
        if (is_null($confectioner)) {
            return null;
        }

        /** @var ConfectionersBusyTime $confectionersBusyTime */
        $confectionersBusyTime = $confectioner->busyTime()->where('work_date', $workDate->toStringYearDayMonth())->first();

        if (is_null($confectionersBusyTime)) {
            /** @var ConfectionersBusyTime $confectionersBusyTime */
            $confectionersBusyTime = ConfectionersBusyTime::query()->create([
                'id_confectioner' => $confectionerId,
                'work_date' => $workDate->toStringYearDayMonth(),
                'busy_time' => $busyTime
            ]);

            return $confectionersBusyTime;
        }

        $currentBusy = BasicIntervalTime::fromIntervalString($confectionersBusyTime->busy_time);
        $currentBusy->add($busyTime);
        $confectionersBusyTime->busy_time = $currentBusy;
        $confectionersBusyTime->save();

        return $confectionersBusyTime;
    }

    /**
     * @throws Exception
     */
    public function subBusyTime(int $confectionerId, BasicDate $workDate, BasicIntervalTime $busyTime): ?ConfectionersBusyTime
    {
        $confectioner = $this->getConfectionerById($confectionerId);
        if (is_null($confectioner)) {
            return null;
        }

        /** @var ConfectionersBusyTime $confectionersBusyTime */
        $confectionersBusyTime = $confectioner->busyTime()->where('work_date', $workDate->toStringYearDayMonth())->first();

        if (is_null($confectionersBusyTime)) {
            /** @var ConfectionersBusyTime $confectionersBusyTime */
            $confectionersBusyTime = ConfectionersBusyTime::query()->create([
                'id_confectioner' => $confectionerId,
                'work_date' => $workDate->toStringYearDayMonth(),
                'busy_time' => $busyTime
            ]);

            return $confectionersBusyTime;
        }

        $currentBusy = BasicIntervalTime::fromIntervalString($confectionersBusyTime->busy_time);
        $currentBusy->sub($busyTime);
        $confectionersBusyTime->busy_time = $currentBusy;
        $confectionersBusyTime->save();

        return $confectionersBusyTime;
    }

    public function getResponseById(int $id): ?ConfectionerResponse
    {
        $confectioner = $this->getConfectionerById($id);
        if (is_null($confectioner)) {
            return null;
        }

        return $confectioner->toConfectionerResponse();
    }

    private function getConfectionerById(int $id): ?Confectioner
    {
        /** @var Confectioner|null $confectioner */
        $confectioner = Confectioner::query()->where('id_role', Role::confectionerRoleId())->find($id);
        return $confectioner;
    }

    /**
     * @return Collection|Confectioner[]
     */
    private function getConfectioners(): Collection|array
    {
        /** @var Confectioner[] $confectioners */
        $confectioners = Confectioner::query()->where('id_role', Role::confectionerRoleId())->get();
        return $confectioners;
    }
}
