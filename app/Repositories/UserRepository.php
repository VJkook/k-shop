<?php

namespace App\Repositories;

use App\Models\Responses\UserResponse;
use App\Models\Role;
use App\Models\User;

class UserRepository
{
    public function create(string $email, string $password, string $name): ?UserResponse
    {
        $attributes = [
            'email' => $email,
            'password' => bcrypt($password),
            'name' => $name,
            'id_role' => Role::clientRoleId()
        ];

        /** @var User $user */
        $user = User::query()->create($attributes);
        return $user->toUserResponse();
    }

    public function getUserByEmail(string $email): ?UserResponse
    {
        /** @var User $user */
        $user = User::query()->where('email', $email)->first();
        if (is_null($user)) {
            return null;
        }

        return $user->toUserResponse();
    }

    /**
     * @return User[]
     */
    public function all(): array
    {
        /** @var User[] $users */
        $users = User::query()->get();
        $responses = [];
        foreach ($users as $user) {
            $responses[] = $user->toUserResponse();
        }

        return $responses;
    }

    /**
     * @return User[]
     */
    public function getConfectioners(): array
    {
        /** @var User[] $users */
        $users = User::query()->where('id_role', Role::confectionerRoleId())->get();
        $responses = [];
        foreach ($users as $user) {
            $responses[] = $user->toUserResponse();
        }

        return $responses;
    }

    public function getAvailableConfectioners(): array
    {
        /** @var User[] $users */
        $users = User::query()
            ->leftJoin()
            ->where('id_role', Role::confectionerRoleId())
            ->get();
        $responses = [];
        foreach ($users as $user) {
            $responses[] = $user->toUserResponse();
        }

        return $responses;
    }
}
