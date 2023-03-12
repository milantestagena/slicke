<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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

    public function getConversation( User $corespondend)
    {
        $data = Conversation::getConversation($this->user, $corespondend);
        return $this->success($data);
    }
}
