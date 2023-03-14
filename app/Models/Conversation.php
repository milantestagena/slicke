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
        $results = DB::select( DB::raw("
        select con.*
            from (select con.*,
                        row_nconber() over (partition by least(con.receiver_id, con.sender_id), greatest(con.receiver_id, con.sender_id) order by con.id desc) as seqncon
                from conversations con
                ) con
            where seqncon = 1 AND (`sender_id` = :userId OR  `receiver_id` = :userId)
    "), array(
            ':userId' => $user->id,
          ));
        return $results;
    }
    public static function getConversation(User $user, int $corespondend){
        return Model::where(
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
