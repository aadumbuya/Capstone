#endpoint 
#http://127.0.0.1:8000/seed_cert_and_tracking/user_create_seed_report

#seed_details
{"username":"divine","data":{"seed_details":{"seed_name":"seed1","company":"company1","location":"location"},"status":"saved"}}
#69c03da9-95e6-4b40-9bbf-9d266534f7e3
#lab_details
{"username":"divine","seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","data":{"lab_details":{"1":{"data":{"parameter1":"1","parameter2":"2","parameter3":"3"},"date":"02/04/2025 10:20pm"}}}}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/user_update_delete_seed_report/update
#lab_details
{"username":"divine","seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","data":{"lab_details":{"25d74a82-e844-4fcb-a42d-d0c0a7365672":{"data":{"parameter1":"5"}}}}}
#69c03da9-95e6-4b40-9bbf-9d266534f7e3

#seed_details
{"username":"divine","seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","data":{"seed_details":{"seed_name":"seed2"}}}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/user_update_delete_seed_report/delete
#lab_details
{"username":"divine","seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","data":{"lab_details":{"25d74a82-e844-4fcb-a42d-d0c0a7365672":1}}}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/inspector_inspector_record
#inspector
{"inspector":"alfred","username":"alfred","data":{"data1":1,"data2":0}}
{"inspector":"alfred","username":"alfred","data":{"status":"pending"}}
#agency
#http://127.0.0.1:8000/seed_cert_and_tracking/agency_update_inspector_report
{"inspector":"alfred","agency":"john","data":{"lockedby":{"who":"john"},"locked":true}}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/agency_agency_record
#agency_p
{"agency":"alfred","username":"alfred","data":{"data1":1,"data2":2}}
{"agency":"alfred","username":"alfred","data":{"status":"pending"}}
#agency
#http://127.0.0.1:8000/seed_cert_and_tracking/agency_update_agency_report
{"agency_p":"alfred","agency":"john","data":{"lockedby":{"who":"john"},"locked":true}}

#endpoint
#user move seed report
#http://127.0.0.1:8000/seed_cert_and_tracking/user_move_seed_report
{"seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","username":"divine"}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/user_seed_track_records
{"seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","username":"peter","from_owner":"divine","to_owner":"peter","date":"03/04/2025 09:53pm", "main":false,"inspector":"alfred"}


#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/main_approve_reject_seed_report
#approve_cert
{"inspector":"alfred","seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","type":"approve","count":2,"date":"03/04/2025 09:53pm"}
#reject_cert
{"inspector":"alfred","seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","type":"reject","count":2,"date":"03/04/2025 09:53pm"}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/main_approve_reject_agency
#approve_agency
{"agency":"john","agency_p":"alfred","type":"approve","count":2,"date":"03/04/2025 09:53pm"}
#reject_agency
{"agency":"john","agency_p":"alfred","type":"reject","count":2,"date":"03/04/2025 09:53pm"}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/main_approve_reject_agency
#approve_inspector
{"agency":"john","inspector":"alfred","type":"approve","count":2,"date":"03/04/2025 09:53pm"}
#reject_inspector
{"agency":"john","inspector":"alfred","type":"reject","count":2,"date":"03/04/2025 09:53pm"}



#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/main_unapprove_reject_seed_report
#approve_cert
{"inspector":"alfred","seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","type":"approve"}
#reject_cert
{"inspector":"alfred","seed_id":"69c03da9-95e6-4b40-9bbf-9d266534f7e3","type":"reject"}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/main_unapprove_reject_agency
#approve_agency
{"agency":"john","agency_p":"alfred","type":"approve"}
#reject_agency
{"agency":"john","agency_p":"alfred","type":"reject"}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/main_unapprove_reject_inspector
#approve_inspector
{"agency":"john","inspector":"alfred","type":"approve"}
#reject_inspector
{"agency":"john","inspector":"alfred","type":"reject"}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/main_delete_inspector_record
{"inspector":"","username":""}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/main_delete_agency_record
{"agency":"","username":""}


#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/api_key_generation
{"owner":"divine"}
#fV6tsciu1XPMuUasPE9w0ZbsO8aULH5U

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/api_key_change_status/revoke
{"owner":"divine","username":"divine"}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/api_key_change_status/active
{"owner":"divine","username":"divine"}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/api_key_change
{"owner":"divine","username":"divine"} 
#fOs4IPd36d1eCNmV7W7qSs5rNaqGmLeL

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/api_create_seed_report/fOs4IPd36d1eCNmV7W7qSs5rNaqGmLeL
{"data":{"seed_details":{"seed_name":"seed1","company":"company1","location":"location"},"status":"saved"}}
#5435d134-3499-4e36-9fd4-d4d2f036c813

{"seed_id":"5435d134-3499-4e36-9fd4-d4d2f036c813","data":{"lab_details":{"1":{"data":{"parameter1":"1","parameter2":"2","parameter3":"3"},"date":"02/04/2025 10:20pm"}}}}

#endpoint
#http://127.0.0.1:8000/seed_cert_and_tracking/api_update_seed_report/fOs4IPd36d1eCNmV7W7qSs5rNaqGmLeL/update
{"seed_id":"5435d134-3499-4e36-9fd4-d4d2f036c813","data":{"lab_details":{"548d8758-e133-472b-ab0b-157f0c022579":{"data":{"parameter1":"5"}}}}}
#5435d134-3499-4e36-9fd4-d4d2f036c813

#://127.0.0.1:8000/seed_cert_and_tracking/user_delete_seed_report
{"username":"","seed_id":""}

#http://127.0.0.1:8000/seed_cert_and_tracking/api_delete_seed_report/fOs4IPd36d1eCNmV7W7qSs5rNaqGmLeL
{"seed_id":""}


#http://127.0.0.1:8000/seed_cert_and_tracking/api_move_seed_report/fOs4IPd36d1eCNmV7W7qSs5rNaqGmLeL
{"seed_id":""}


#http://127.0.0.1:8000/seed_cert_and_tracking/api_update_seed_report/fOs4IPd36d1eCNmV7W7qSs5rNaqGmLeL/delete
{"seed_id":"5435d134-3499-4e36-9fd4-d4d2f036c813","data":{"lab_details":{"548d8758-e133-472b-ab0b-157f0c022579":1}}}

#http://127.0.0.1:8000/seed_cert_and_tracking/delete_inspector_record
{"inspector":"","username":""}

#http://127.0.0.1:8000/seed_cert_and_tracking/delete_agency_record
{"agency":"","username":""}

#http://127.0.0.1:8000/seed_cert_and_tracking/api_key_delete
{"owner":"","username":""}

#http://127.0.0.1:8000/seed_cert_and_tracking/main_user_record
{"username":"","data":{"location":"location"}}

#http://127.0.0.1:8000/seed_cert_and_tracking/main_get_user_record/username

#http://127.0.0.1:8000/seed_cert_and_tracking/main_get_full_seed_report/seed_id

#http://127.0.0.1:8000/seed_cert_and_tracking/main_get_full_inspector_details/inspector

#http://127.0.0.1:8000/seed_cert_and_tracking/main_get_full_agency_details/agency

#http://127.0.0.1:8000/seed_cert_and_tracking/main_get_full_old_seed_details/seed_id

#http://127.0.0.1:8000/seed_cert_and_tracking/main_get_full_entity_seed_details/entity

#http://127.0.0.1:8000/seed_cert_and_tracking/main_get_api_key/owner

#http://127.0.0.1:8000/seed_cert_and_tracking/main_get_full_seed_track_details/seed_id

{"lockedby":{"who":"","type":""}}

