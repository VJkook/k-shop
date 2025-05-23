<?php

namespace App\Models\Responses;

use App\Models\CakeForm;

class CakeFormResponse
{
    public function __construct(
        public int                $id,
        public string             $name,
    )
    {
    }

    public static function fromCakeForm(CakeForm $cakeForm): self
    {
        return new CakeFormResponse(
            $cakeForm->id,
            $cakeForm->name,
        );
    }
}
