<?php
namespace App\Enums;

enum ProposalState:string {
    case Active = 'active';
    case NotPossible = 'not_possible';
    case Rejected = 'rejected';
    case Accepted = 'accepted';
};

