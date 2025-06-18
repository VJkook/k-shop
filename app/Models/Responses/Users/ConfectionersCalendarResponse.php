<?php

namespace App\Models\Responses\Users;

use App\Models\BasicDate;

class ConfectionersCalendarResponse
{
    /**
     * @param ConfectionersCalendarDateResponse[] $dates
     */
    public function __construct(
        public array $dates = []
    )
    {
    }

    public function addConfectionerToDate(BasicDate $date, ConfectionerBusyResponse $confectioner): void
    {
        $existingDate = array_find($this->dates, function (ConfectionersCalendarDateResponse $existDate) use ($date) {
            return $existDate->date === $date->toDateString();
        });

        if (is_null($existingDate)) {
            $dateItem = new ConfectionersCalendarDateResponse($date->toDateString());
            $dateItem->addConfectioner($confectioner);
            $this->dates[] = $dateItem;
            return;
        }

        $existingDate->addConfectioner($confectioner);
    }
}
