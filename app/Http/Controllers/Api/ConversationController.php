<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreConversationRequest;

class ConversationController extends Controller
{
    //
    use HttpResponses;
    private $user;
    public function _construct()
    {
        parent::_construct();
        $this->user = Auth::user();
    }
    public function getConversations()
    {
        $data = Conversation::getConversations($this->user);
        return $this->success($data);
    }

    public function getConversation( Request $request)
    {
        $data = Conversation::getConversation($this->user, $request->query('with'));
        return $this->success($data);
    }

    public function sendMessage( StoreConversationRequest $request)
    {
        $to = $request->query('to');
        $message = new Conversation;
        $message->from = $this->user->id;
        $message->to = $to;
        $message->message = $request->input('message');

        try {
            $message->save();
            return $this->success('Message sent');
        } catch (\Throwable $th) {
            //throw $th;
            return $this->error('Message not sent', 400);
        }

    }
}
