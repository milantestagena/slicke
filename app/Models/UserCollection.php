<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class UserCollection extends Model
{
    use HasFactory;

    //protected $table = 'user_collections';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
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
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(UserItem::class, 'user_collection_id');
    }
    public static function userCollections($user)
    {
        return UserCollection::where('user_id', $user->id)->get();
    }
    public static function userCollection($userId, $collectionId)
    {
        return UserCollection::firstOrCreate([
            'user_id' => $userId,
            'collection_id' => $collectionId
        ]);
    }

    public static function getCollectionId($userId, $collectionId)
    {
        return UserCollection::where('user_id', (int)$userId)->where('collection_id', (int)$collectionId)->first()->id;
    }

    public static function checkForDoubles($collectionId, $userId, $doubles){
        $forLogged = Auth::user()->id === $userId;

        foreach($doubles as $id){
            $double = UserItem::findOrFail($id);
            if($double->counter <=1){
                if($forLogged){
                    $errorMesage = "Some of your items is not duplicate.";
                } else {
                    $errorMesage = "Some of items you selected is not duplicate anymore.";
                }
                throw new \Exception($errorMesage);
            }
        }
        return true;
    }

    public function updateItems($items){
        foreach($items as $key => $value){
            $ui = UserItem::find((int)$key);
            $ui->counter = $value;
            $ui->update();
        }
    }

    public function doubles(): HasMany
    {
        return $this->hasMany(Double::class, 'user_collection_id');
    }

    public function missing(): HasMany
    {
        return $this->hasMany(Missing::class, 'user_collection_id');
    }

    public function deleteDoubles(){
        $this->doubles->delete();
    }

    public function deleteMissing(){
        $this->missing->delete();
    }

    public function deleteDoublesForUser(){
        DB::table('doubles')->where('user_id', $this->user->id)->delete();
    }

    public function deleteMissingForUser(){
        DB::table('missing')->where('user_id',$this->user->id)->delete();
    }

    public function createDoublesForUser(){
        DB::table('doubles')->insertUsing([
            'user_id', 'collection_id', 'user_collection_id', 'item_id'
        ], DB::table('user_items', )->select(
            'user_collections.user_id', 'user_collections.collection_id', 'user_items.user_collection_id', 'user_items.item_id'
        )
        ->join('user_collections', 'user_collections.id', '=', 'user_items.user_collection_id')
        ->where('user_collections.id', '=', $this->id)
        ->where('user_items.counter', '>', 1));
    }

    public function createMissingForUser(){
        DB::table('missing')->insertUsing([
            'user_id', 'collection_id', 'user_collection_id', 'item_id'
        ], DB::table('user_items', )->select(
            'user_collections.user_id', 'user_collections.collection_id', 'user_items.user_collection_id', 'user_items.item_id'
        )
        ->join('user_collections', 'user_collections.id', '=', 'user_items.user_collection_id')
        ->where('user_collections.id', '=', $this->id)
        ->where('user_items.counter', '=', 0));
    }

    public function getFormatedDoubles(){
        return 
        DB::select("
        SELECT
            d.user_id as double_user_id,
            m.user_id as missing_user_id,
            u.membership_id,
            d.collection_id as collection_id,
            d.user_collection_id as double_user_collection_id,
            m.user_collection_id as missing_user_collection_id,
            GROUP_CONCAT(d.item_id SEPARATOR '|') AS item_ids,
            COUNT(m.item_id) as to_offer
        FROM doubles d
        JOIN missing m ON m.item_id = d.item_id
        JOIN users u ON m.user_id = u.id
        WHERE d.user_collection_id = ?
        GROUP BY m.user_id, d.user_id
        ORDER BY membership_id DESC, to_offer DESC", [$this->id]);
            

    }
    public function getFormatedMissing(){
        return 
            DB::select("
                SELECT
                    d.user_id as double_user_id,
                    m.user_id as missing_user_id,
                    u.membership_id,
                    d.collection_id as collection_id,
                    d.user_collection_id as double_user_collection_id,
                    m.user_collection_id as missing_user_collection_id,
                    GROUP_CONCAT(d.item_id SEPARATOR '|') as item_ids,
                    COUNT(m.item_id) as to_offer
                FROM missing m
                JOIN doubles d ON d.item_id = m.item_id
                JOIN users u ON d.user_id = u.id
                WHERE m.user_collection_id = ?
                GROUP BY m.user_id, d.user_id
                ORDER BY membership_id DESC, to_offer DESC
            ", [$this->id]);
        
    }

    public function prepareMatchingDataForBatchInsert(){
        $data = [];
        foreach($this->getFormatedDoubles() as $double){
            $data[$double->missing_user_id] = [
                'toGiveCount' => $double->to_offer,
                'toReceiveCount' => 0,
                'toGiveIds' => $double->item_ids,
                'toReceiveIds' => "",
            ];
        }
        
        foreach($this->getFormatedMissing() as $missing){
            if(!$data[$double->missing_user_id]){
                $data[$double->missing_user_id] = [
                    'toGiveCount' => 0,
                    'toGiveIds' => "",
                ];
            } 
            $data[$double->missing_user_id]['toReceiveCount'] = $missing->to_offer;
            $data[$double->missing_user_id]['toReceiveIds'] = $missing->item_ids;
        }

        $dbData = [];
        foreach($data as $otherUser => $userData){
            $loggedUserIsOlder = $this->user->id < $otherUser;
            $dbData[] = [
                'collection_id' => $this->collection->id,
                'user_1_id' => $loggedUserIsOlder ? $this->user->id : $otherUser,
                'user_2_id' => $loggedUserIsOlder ? $otherUser : $this->user->id,
                'item_count_1' => $loggedUserIsOlder ? $userData['toGiveCount'] : $userData['toReceiveCount'],
                'item_count_2' => $loggedUserIsOlder ? $userData['toReceiveCount'] : $userData['toGiveCount'],
                'item_ids_1' => $loggedUserIsOlder ? $userData['toGiveIds'] : $userData['toReceiveIds'],
                'item_ids_2' => $loggedUserIsOlder ? $userData['toReceiveIds'] : $userData['toGiveIds'],
            ];
        }
        return $dbData;
    }

    public function updateMatchingEntities(){
        $this->deleteDoublesForUser();
        $this->deleteMissingForUser();
        $this->createDoublesForUser();
        $this->createMissingForUser();
    }
}
