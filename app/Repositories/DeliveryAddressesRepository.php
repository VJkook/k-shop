<?php

namespace App\Repositories;

use App\Models\Decor;
use App\Models\DeliveryAddress;
use App\Models\Responses\DeliveryAddressResponse;

class DeliveryAddressesRepository
{
    public function create(array $attributes): ?DeliveryAddressResponse
    {
        /** @var DeliveryAddress $deliveryAddress */
        $deliveryAddress = DeliveryAddress::query()->create($attributes);
        return $deliveryAddress->toResponse();
    }

    /**
     * @return DeliveryAddressResponse[]
     */
    public function all(): array
    {
        $result = [];
        $addresses = DeliveryAddress::query()->get();
        /** @var DeliveryAddress $address */
        foreach ($addresses as $address) {
            $response = $address->toResponse();
            $result[] = $response;
        }

        return $result;
    }

    public function getById(int $id): DeliveryAddressResponse
    {
        /** @var DeliveryAddress $deliveryAddress */
        $deliveryAddress = DeliveryAddress::query()->find($id);
        return $deliveryAddress->toResponse();
    }

    /**
     * @return DeliveryAddressResponse[]
     */
    public function getByUserId(int $userId): array
    {
        $result = [];
        $addresses = DeliveryAddress::query()
            ->where('id_user', '=', $userId)
            ->get();
        /** @var DeliveryAddress $address */
        foreach ($addresses as $address) {
            $response = $address->toResponse();
            $result[] = $response;
        }

        return $result;
    }

    public function updateById(int $id, array $attributes): DeliveryAddressResponse
    {
        /** @var DeliveryAddress $deliveryAddress */
        $deliveryAddress = DeliveryAddress::query()->find($id);
        $deliveryAddress->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return Decor::query()->find($id)->delete();
    }
}
