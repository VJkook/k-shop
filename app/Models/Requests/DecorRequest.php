<?php

namespace App\Models\Requests;

class DecorRequest
{
    public function __construct(
        public int $id,
        public int $count,
    )
    {
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'count' => $this->count,
        ];
    }
}
