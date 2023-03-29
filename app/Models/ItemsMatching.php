<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemsMatching extends Model
{
    use HasFactory;
     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
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
        return $this->belongsTo(Collection::class, 'collection_id');
    }

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_1_id');
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_2_id');
    }


    public static function deleteForUser($userId){
        ItemsMatching::where('user_1_id', '=', $userId)->delete();
        ItemsMatching::where('user_2_id', '=', $userId)->delete();
    }

    public static function insertBatchForUser($batch){
        ItemsMatching::insert($batch);
    }

    public static function getMatchesForUser($collectionId, $userId){
        $data = [];
        // handle all as user_1_id
        $first = ItemsMatching::where('collection_id', '=', $collectionId)
            ->where('user_1_id', '=', $userId)->get();
        foreach($first as $el){
            $data[$el->user_2_id] = [
                'toGiveCount' =>  $el->item_count_1,
                'toTakeCount' =>  $el->item_count_2,
                'toGiveIds' =>  explode($el->item_ids_1, "|"),
                'toTakeIds' =>  explode($el->item_ids_2, "|"),
                'minCount' => min($el->item_count_1, $el->item_count_2),
                'membership' => $el->user2->membership_id
            ];
        }
        $second = ItemsMatching::where('collection_id', '=', $collectionId)
            ->where('user_2_id', '=', $userId)->get();
        foreach($second as $el){
            $data[$el->user_1_id] = [
                'toGiveCount' =>  $el->item_count_2,
                'toTakeCount' =>  $el->item_count_1,
                'toGiveIds' =>  explode($el->item_ids_2, "|"),
                'toTakeIds' =>  explode($el->item_ids_1, "|"),
                'minCount' => min($el->item_count_1, $el->item_count_2),
                'membership' => $el->user1->membership_id
            ];
        }

        $column1 = array_column($data, 'membership');
        $column2 = array_column($data, 'minCount');
        array_multisort(
            $column1, SORT_DESC,
            $column2, SORT_DESC,
            $data);
        return $data;
    }

}
