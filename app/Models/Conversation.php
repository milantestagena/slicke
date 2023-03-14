<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conversation extends Model
{
    use HasFactory;
     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [

    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getConversations(User $user){
        $results = DB::select("
        select um.sender_id, um.receiver_id, um.message, su.name as sender_name, ru.name as receiver_name, um.created_at
        from (select um.*,
                    row_number() over (partition by least(um.receiver_id, um.sender_id), greatest(um.receiver_id, um.sender_id) order by um.id desc) as seqnum
            from conversations um
            ) um
        JOIN users su ON `sender_id` = `su`.`id`
        JOIN users ru ON `receiver_id` = `ru`.`id`
        where seqnum = 1 AND (`sender_id` = :sender OR  `receiver_id` = :receiver)
        ORDER BY um.created_at desc
    ", array(
            ':receiver' => $user->id,
            ':sender' => $user->id,
        )
    );
        return $results;
    }
    public static function getConversation(User $user, int $corespondend){
        return Conversation::where(
            function($query) use ($user, $corespondend){
                $query->where(function($query) use ($user, $corespondend){
                    $query->where('sender_id', $user->id);
                    $query->where('receiver_id', $corespondend);
                });
                $query->orWhere(function($query) use ($user, $corespondend){
                    $query->where('sender_id', $corespondend);
                    $query->where('receiver_id', $user->id);
                });
            }
        )->orderBy('created_at', 'asc')->get();

    }

}
