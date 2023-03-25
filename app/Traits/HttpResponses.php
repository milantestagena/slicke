<?php

namespace App\Traits;

trait HttpResponses {

    protected function success($data, string $message = null, int $code = 200)
    {
        return response()->json([
            'status' => 'Request was successful.',
            'message' => $message,
            'data' => $data
        ], $code);
    }

    protected function error(string $message = null, int $code, $data = null)
    {
        return response()->json([
            'message' => $message,
            'errors' => $data
        ], $code);
    }
}
