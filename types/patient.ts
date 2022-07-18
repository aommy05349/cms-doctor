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
