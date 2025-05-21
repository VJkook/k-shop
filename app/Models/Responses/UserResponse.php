<?php

namespace App\Models\Responses;

use App\Models\User;

class UserResponse
{
    public function __construct(
        public int    $id,
        public string $name,
        public string $role = '',
    )
    {
    }

    public static function fromUser(User $user, string $role): self
    {
        return new UserResponse(
            $user->id,
            $user->name,
            $role
        );
    }
}
