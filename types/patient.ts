export interface Patient {
    member_id: string;
    fname: string;
    lname: string;
    email: string;
    gender: string;
    frequency_pain: string;
    age: string;
    birthdate: string;
    height: string;
    weight: string;
    migraine_type: string;
    migraine_age: string;
    group_id: string;
    job: string;
    subscription: string;
    cf: string;
    add_dtm: string;
    profile_img: string;
    phone_number: string;
    symptom?: any;
    is_premium_member: boolean;
    is_trial_product: boolean;
    is_premium_product?: any;
    is_premium_amount?: any;
    headache_status: boolean;
    start_dtm: string;
    stop_dtm: string;
    member_period: string;
}

export interface PatientHistory {
    addinfo_id: string;
    expert_id: string;
    expert_fname: string;
    expert_lname: string;
    expert_profile: string;
    member_id: string;
    member_fname: string;
    member_lname: string;
    member_profile: string;
    add_dtm: string;
    update_dtm: string;
    additional_information: string;
}

export interface MigraineLevel {
    score: number;
    level: number;
    detail: string;
    description: string;
    msg: string;
}

export interface FrequencyTrigger {
    bg_active_tigger: string;
    bg_inactive_trigger: string;
    count_trigger: string;
    nbg_active_trigger: string;
    nbg_inactive_trigger: string;
    percentage: number;
    trigger_beware: string;
    trigger_body: string;
    trigger_id: string;
    trigger_name: string;
}

export interface Medication {
    pain_reliever: Array<FrequencyMedication>;
    preventive_medicine: Array<FrequencyMedication>;
}

export interface FrequencyMedication {
    member_id: Patient['member_id'];
    medicine_id: string;
    status: string;
    name: string;
    type: string;
    count_med: string;
    image: string;
}

export interface PainRecordDaily {
    date: string;
    score_pain: string;
}

export interface PainRecordMonthly {
    date: string;
    label: string;
    score_pain: {
        score_0: number;
        score_1: number;
        score_2: number;
        score_3: number;
    };
}
