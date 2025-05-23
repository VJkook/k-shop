<?php

namespace App\Repositories;

use App\Models\CakeForm;
use App\Models\Responses\CakeFormResponse;

class CakeFormsRepository
{
    public function create(array $attributes): ?CakeFormResponse
    {
        /** @var CakeForm $cakeForm */
        $cakeForm = CakeForm::query()->create($attributes);
        return $this->buildResponse($cakeForm);
    }

    /**
     * @return CakeFormResponse[]
     */
    public function all(): array
    {
        $result = [];
        $cakeForms = CakeForm::query()->get();
        /** @var CakeForm $cakeForm */
        foreach ($cakeForms as $cakeForm) {
            $cakeFormResponse = $this->buildResponse($cakeForm);
            $result[] = $cakeFormResponse;
        }

        return $result;
    }

    public function getById(int $id): CakeFormResponse
    {
        /** @var CakeForm $cakeForm */
        $cakeForm = CakeForm::query()->find($id);
        return $this->buildResponse($cakeForm);
    }

    public function updateById(int $id, array $attributes): CakeFormResponse
    {
        /** @var CakeForm $cakeForm */
        $cakeForm = CakeForm::query()->find($id);
        $cakeForm->update($attributes);
        return $this->getById($id);
    }

    public function deleteById(int $id): bool
    {
        return CakeForm::query()->find($id)->delete();
    }

    private function buildResponse(CakeForm $cakeForm): CakeFormResponse
    {
        return new CakeFormResponse(
            $cakeForm->id,
            $cakeForm->name,
        );
    }
}
