<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    const TOKEN_NAME = '_token';

    public function __construct(protected UserRepository $userRepo)
    {
    }

    public function getToken(Request $request): Application|Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|ResponseFactory
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return \response($validator->errors()->getMessages());
        }

        /** @var User $user */
        $user = User::query()->where('email', $request->email)->first();
        if (!$user) {
            return \response()->json(['msg' => 'page not found'], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return \response()->json(['msg' => 'incorrect email or password'], 403);
        }

        $response = [
            'token' => $user->createToken(self::TOKEN_NAME)->plainTextToken
        ];
        return \response()->json($response);
    }

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $userResponse = $this->userRepo->getUserByEmail($request->email);
        if (is_null($userResponse)) {
            $userResponse = $this->userRepo->create($request->email, $request->password, $request->name);
        } else {
            throw ValidationException::withMessages([
                'user' => ['the user exists'],
            ]);
        }

        if (Auth::attempt($validator->validated())) {
            $request->session()->regenerate();
            return \response()->json($userResponse);
        }

        return response()->json(['msg' => 'fail register'], 520);
    }

    public function login(Request $request): Application|Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|ResponseFactory
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return \response()->json($request->user());
        }

        return \response()->json(['msg' => ['incorrect email or password']], 401);
    }

//    public function resetPassword(Request $request): JsonResponse
//    {
//        $validator = Validator::make($request->all(), [
//            'email' => 'required|email',
//        ]);
//
//        if ($validator->fails()) {
//            return \response()->json($validator->errors()->getMessages(), 400);
//        }
//
//        $user = User::where('email', $request->email)->first();
//
//        if (!$user) {
//            return \response()->json(['msg' => 'user not found'], 403);
//        }
//
//        Password::createToken($user);
//
//        $token = DB::table('password_reset_tokens')
//            ->select('token')
//            ->where('email', '=', $user->email)
//            ->first();
//        $sentResponse = Mail::to($user->email)->send(new ResetPassword($user->email, urlencode($token->token)));
//
//        if ($sentResponse !== null) {
//            return response()->json([
//                'msg' => 'Link for password reset sent on your email',
//            ]);
//        }
//
//        return response()->json([
//            'msg' => 'sent email error, please try again later',
//        ], 500);
//    }

    public function changePassword(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'email' => 'required',
            'token' => 'required',
            'password' => 'required|string|confirmed|max:20|min:8'
        ]);

        $find_reset = DB::table('password_reset_tokens')
            ->where('token', '=', $fields['token'])
            ->where('email', '=', $fields['email'])
            ->first();

        if (!$find_reset) {
            return response()->json(['msg' => 'Токен не найден'], 403);
        }

        /**
         * @var User $user
         */
        $user = Password::getUser($request->only('email'));
        $user->password = bcrypt($fields['password']);
        $user->save();

        Password::deleteToken($user);
        return \response()->json(['msg' => 'Пароль успешно изменён!']);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        return \response()->json(['msg' => 'logout success']);
    }

    public function getUser(): JsonResponse
    {
        return \response()->json(Auth::user());
    }
}
