from django.urls import path

from .views import *

urlpatterns = [
    #USER ENDPOINTS
    path("main_user_record", main_user_record), 
    path("main_get_user_record/<str:username>", main_get_user_record), 
    path("getuser_label/<str:username>", getuser_label), 
    
    #SEED ENDPOINTS
    path("user_create_seed_report", user_create_seed_report), 
    path("user_update_delete_seed_report/<str:status>", user_update_delete_seed_report), 
    path("main_get_full_seed_report/<str:seed_id>", main_get_full_seed_report), 
    path("user_move_seed_report", user_move_seed_report), 
    path("main_get_full_old_seed_details/<str:seed_id>", main_get_full_old_seed_details), 
    path("user_seed_track_records", user_seed_track_records), 
    path("main_get_full_seed_track_details/<str:seed_id>", main_get_full_seed_track_details), 
    path("main_approve_reject_seed_report", main_approve_reject_seed_report), 
    path("main_unapprove_reject_seed_report", main_unapprove_reject_seed_report), 
    path("user_delete_seed_report", user_delete_seed_report),
    path("getlocked_by/<str:seed_id>", getlocked_by),
    path("getinspector_pending_seed_reports", getinspector_pending_seed_reports),
    path("agencypending_seed_reports", agencypending_seed_reports),
    path("getuser_seed_reports/<str:username>", getuser_seed_reports),
    
    #INSPECTOR ENDPOINTS
    path("inspector_update_seed_report/<str:status>", inspector_update_seed_report),
    path("agency_update_inspector_report", agency_update_inspector_report), 
    path("inspector_inspector_record", inspector_inspector_record), 
    path("main_get_full_inspector_details/<str:inspector>", main_get_full_inspector_details), 
    path("main_approve_reject_inspector", main_approve_reject_inspector), 
    path("main_unapprove_reject_inspector", main_unapprove_reject_inspector),
    path("main_delete_inspector_record", main_delete_inspector_record),
    path("get_inspector_records_status/<str:inspector>/<str:username>", get_inspector_recordsStatus),  
    
    #AGENCY ENDPOINTS
    path("agency_update_seed_report/<str:status>", agency_update_seed_report), 
    path("agency_agency_record", agency_agency_record), 
    path("agency_update_agency_report", agency_update_agency_report), 
    path("main_get_full_agency_details/<str:agency>", main_get_full_agency_details), 
    path("main_approve_reject_agency", main_approve_reject_agency), 
    path("main_unapprove_reject_agency", main_unapprove_reject_agency),
    path("main_delete_agency_record", main_delete_agency_record), 
    path("get_agency_records_status/<str:agency>/<str:username>", get_agency_recordsStatus),
    path("get_inspector_records/<str:agency>/<str:status>", get_inspectorRecords),
    path("get_agency_records/<str:agency>/<str:status>", get_agencyRecords),

    ##ENTITY ENDPOINTS
    path("main_get_full_entity_seed_details/<str:entity>", main_get_full_entity_seed_details),

    #API ENDPOINTS
    path("api_key_generation", api_key_generation), 
    path("api_key_change", api_key_change), 
    path("api_key_delete", api_key_delete), 
    path("api_key_change_status/<str:status>", api_key_change_status), 
    path("main_get_api_key/<str:owner>", main_get_api_key), 
    path("api_create_seed_report/<str:api_key>", api_create_seed_report),
    path("api_update_seed_report/<str:api_key>/<str:status>", api_update_seed_report),
    path("api_delete_seed_report/<str:api_key>", api_delete_seed_report),
    path("api_move_seed_report/<str:api_key>", api_move_seed_report),

]



