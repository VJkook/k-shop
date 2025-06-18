<?php

namespace App\Models\Responses\Users;

class ConfectionersCalendarDateResponse
{
    /**
     * @param string $date
     * @param ConfectionerBusyResponse[] $confectioners
     */
    public function __construct(
        public string $date,
        public array  $confectioners = [],
    )
    {
    }

    public function addConfectioner(ConfectionerBusyResponse $newConfectioner): void
    {
        $exists = array_find($this->confectioners, function (ConfectionerBusyResponse $confectioner) use ($newConfectioner) {
            return $confectioner === $newConfectioner;
        });

        if ($exists) {
            return;
        }

        $this->confectioners[] = $newConfectioner;
    }
}
