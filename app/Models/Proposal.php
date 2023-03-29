<?php

namespace App\Models;

use App\Enums\ProposalState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proposal extends Model
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
        'collection_id',
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
        'status' => ProposalState::class,
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class, 'collection_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProposalItem::class, 'proposal_id');
    }

    public function createItems($userId, $items){
        foreach($items as $item){
            ProposalItem::create([
                'proposal_id' => $this->id,
                'user_id' => $userId,
                'item_id' => $item,
            ]);
        }
    }

    public function checkIfIsStillActive(){
        $senderItems = $this->items->where('user_id', '=', $this->sender_id)->pluck('user_item_id');
        $receiverItems = $this->items->where('user_id', '=', $this->receiver_id)->pluck('user_item_id');
        UserCollection::checkForDoubles($this->collection_id, $this->sender_id, $senderItems);
        UserCollection::checkForDoubles($this->collection_id, $this->receiver_id, $receiverItems);
    }

    public function accept(){
        foreach($this->items as $item){
            $isSender = $this->sender_id === $item->user_id;
            $item->item->decrement('counter', 1);
            if($isSender){
                $userCollection = UserCollection::userCollection($this->receiver_id, $this->collection_id);
            } else {
                $userCollection = UserCollection::userCollection($this->sender_id, $this->collection_id);
            }
            UserItem::where('user_collection_id', $userCollection->id)->where('item_id', $item->item->item->id)->increment('counter', 1);
            $userCollection->updateMatchingEntities();
            ItemsMatching::rebuildMatching($userCollection);
        }
        $this->state = 'accepted';
        $this->save();
    }
}
