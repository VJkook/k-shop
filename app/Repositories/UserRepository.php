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
        return $this->buildResponse($user);
    }

    public function getUserByEmail(string $email): ?UserResponse
    {
        /** @var User $user */
        $user = User::query()->where('email', $email)->first();
        if (is_null($user)) {
            return null;
        }

        return $this->buildResponse($user);
    }

    private function buildResponse(User $user): UserResponse
    {
        /** @var Role $role */
        $role = $user->role()->first();
        $response = new UserResponse(
            $user->id,
            $user->name,
            $role->name
        );

        return $response;
    }
}
