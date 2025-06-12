<?php

namespace App\Models\Responses;

use App\Models\BasicDate;
use Carbon\Carbon;

class CookingStepResponse
{
    public function __construct(
        public int                $id,
        public string|null        $description,
        public int                $step_number,
        public string             $step_time,
        public ImageResponse|null $image = null,
    )
    {
    }

    public function setImage(ImageResponse $image): void
    {
        $this->image = $image;
    }
}
