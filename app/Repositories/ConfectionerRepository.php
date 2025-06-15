<?php

namespace App\Repositories;

use App\Models\BasicDate;
use App\Models\BasicIntervalTime;
use App\Models\Confectioner;
use App\Models\ConfectionersBusyTime;
use App\Models\Role;
use App\Models\User;
use Exception;

class ConfectionerRepository
{
    /**
     * @return User[]
     */
    public function all(): array
    {
        /** @var Confectioner[] $users */
        $users = Confectioner::query()->where('id_role', Role::confectionerRoleId())->get();
        $responses = [];
        foreach ($users as $user) {
            $responses[] = $user->toUserResponse();
        }

        return $responses;
    }

    public function getAvailableByDate(BasicDate $date): array
    {
        /** @var Confectioner[] $users */
        $users = Confectioner::query()->where('id_role', Role::confectionerRoleId())->get();
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
        $confectioner = Confectioner::query()->find($confectionerId);

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
        /** @var Confectioner $confectioner */
        $confectioner = Confectioner::query()->find($confectionerId);
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
}
