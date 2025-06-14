<?php

namespace App\Repositories;

use App\Models\BasicIntervalTime;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Carbon;

class ConfectionerRepository
{
    /**
     * @return User[]
     */
    public function all(): array
    {
        /** @var User[] $users */
        $users = User::query()->where('id_role', Role::confectionerRoleId())->get();
        $responses = [];
        foreach ($users as $user) {
            $responses[] = $user->toResponse();
        }

        return $responses;
    }

    public function getBusyTime(int $confectionerId, Carbon $date): ?BasicIntervalTime
    {

    }
}
