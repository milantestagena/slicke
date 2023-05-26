<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserPublicResource;

class AuthController extends Controller
{
    use HttpResponses;
    public function signup(Request $request)
    {
        dd($request);
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'country_id' => $data['country_id'],
            'membership_id' => $data['membership_id']
        ]);

        $token = $user->createToken('main')->plainTextToken;
        return $this->success([
            'user' => new UserPublicResource($user),
            'token' => $token
        ]);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return $this->error('Provided email or password is incorrect', 422);
        }

        /** @var \App\Models\User $user */
        $user = User::findOrFail(Auth::user()->id);
        $token = $user->createToken('main')->plainTextToken;
        return $this->success([
            'user' => new UserPublicResource($user),
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return $this->success([], "Loged out", 204);
    }
}
