<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserPublicResource;
use App\Http\Requests\StoreConversationRequest;


class ConversationController extends Controller
{
    //
    use HttpResponses;

    public function getConversations()
    {
        $user = Auth::user();
        $data = Conversation::getConversations($user);
        return $this->success($data);
    }

    public function getConversation(int $with)
    {
        $user = Auth::user();
        $data = Conversation::getConversation($user, $with);
        $corespondent = User::findOrFail($with);
        return $this->success(
            (object)[
                'conversation' => $data,
                'corenspondent' => new UserPublicResource($corespondent)
            ]);
    }

    public function sendMessage(int $to,  StoreConversationRequest $request)
    {
        $user = Auth::user();
        $message = new Conversation;
        $message->sender_id = $user->id;
        $message->receiver_id = $to;
        $message->message = $request->input('message');

        try {
            $message->save();
            return $this->success('Message sent');
        } catch (\Throwable $th) {
            //throw $th;
            return $this->error('Message not sent', 400, $th);
        }

    }
}
