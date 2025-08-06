<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemsMatching extends Model
{
    use HasFactory;

    protected $table = 'items_matching';

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

    public static function deleteForUser($collection_id, $userId)
    {
        self::ensureTableExists($collection_id);
        $itemsMatching = new ItemsMatching;
        $itemsMatching->setTable('items_matching_' . $collection_id);
        $itemsMatching->where('user_1_id', '=', $userId)->delete();
        $itemsMatching->where('user_2_id', '=', $userId)->delete();
    }

    public static function insertBatchForUser($collection_id, $batch)
    {
        self::ensureTableExists($collection_id);
        $itemsMatching = new ItemsMatching;
        $itemsMatching->setTable('items_matching_' . $collection_id);
        $itemsMatching->insert($batch);

    }

    public static function getMatchesForUser($collection_id, $userId)
    {
        self::ensureTableExists($collection_id);

        $itemsMatching = new ItemsMatching;
        $itemsMatching->setTable('items_matching_' . $collection_id);
        $matches = [];

        // korisnik je user_1
        $queryFirst = $itemsMatching
            ->where('collection_id', '=', $collection_id)
            ->where('user_1_id', '=', $userId->id)
            ->get();

        foreach ($queryFirst as $el) {
            $matches[] = [
                'collectionId' => $el->collection_id,
                'otherUserId' => $el->user_2_id,
                'otherUserName' => $el->user2->fullname ?? null,
                'toGiveCount' => $el->item_count_1,
                'toTakeCount' => $el->item_count_2,
                'toGiveIds' => explode('|', $el->item_ids_1),
                'toTakeIds' => explode('|', $el->item_ids_2),
                'minCount' => min($el->item_count_1, $el->item_count_2),
                'membership' => $el->user2->membership_id ?? null,
            ];
        }

        // korisnik je user_2
        $querySecond = $itemsMatching
            ->where('collection_id', '=', $collection_id)
            ->where('user_2_id', '=', $userId->id)
            ->get();

        foreach ($querySecond as $el) {
            $matches[] = [
                'collectionId' => $el->collection_id,
                'otherUserId' => $el->user_1_id,
                'otherUserName' => $el->user1->fullname ?? null,
                'toGiveCount' => $el->item_count_2,
                'toTakeCount' => $el->item_count_1,
                'toGiveIds' => explode('|', $el->item_ids_2),
                'toTakeIds' => explode('|', $el->item_ids_1),
                'minCount' => min($el->item_count_1, $el->item_count_2),
                'membership' => $el->user1->membership_id ?? null,
            ];
        }

        // sortiraj po membership i minCount
        usort($matches, function ($a, $b) {
            return [$b['membership'], $b['minCount']] <=> [$a['membership'], $a['minCount']];
        });

        return $matches;
    }

    public static function rebuildMatching(UserCollection $userCollection)
    {
        ItemsMatching::deleteForUser($userCollection->collection->id, $userCollection->user->id);
        $data = $userCollection->prepareMatchingDataForBatchInsert();
        ItemsMatching::insertBatchForUser($userCollection->collection->id, $data);
    }


    public static function ensureTableExists($collectionId)
    {
        $tableName = 'items_matching_' . $collectionId;

        if (!\Schema::hasTable($tableName)) {
            \Schema::create($tableName, function ($table) {
                $table->id();
                $table->unsignedBigInteger('collection_id');
                $table->unsignedBigInteger('user_1_id');
                $table->unsignedBigInteger('user_2_id');
                $table->integer('item_count_1')->default(0);
                $table->integer('item_count_2')->default(0);
                $table->text('item_ids_1')->nullable();
                $table->text('item_ids_2')->nullable();
                $table->timestamps();
            });
        }
    }
}
