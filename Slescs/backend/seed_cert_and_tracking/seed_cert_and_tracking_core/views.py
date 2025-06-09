from json import loads,dumps

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.db.models import Q

from .serializers import (SeedReportRecordsSerializer,InspectorRecordsSerializer,AgencyRecordsSerializer,EntitySeedRecordsSerializer,ApiKeyRecordsSerializer,UserRecordsSerializer,OldSeedReportRecordsSerializer,SeedTrackRecordsSerializer) 
from .models import (SeedReportRecords,InspectorRecords,AgencyRecords,EntitySeedRecords,ApiKeyRecords,UserRecords,OldSeedReportRecords,SeedTrackRecords)
from . import seed_certification_and_trackability_core_functions_api as sc
import uuid
from .helper import * 



@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_user_record(request):
    data =  request.data
    if check_user_exist(data["username"]):
        return user_record(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def main_get_user_record(request,username):
    return get_user_record(username)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def user_delete_seed_report(request):
    data =  request.data
    if confirm_user(data["username"],data["seed_id"]) and check_seed_delete_report_status(data["seed_id"]):
        return main_delete_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_delete_seed_report(request,api_key):
    data =  request.data
    if confirm_api_key(api_key,data["seed_id"]) and check_seed_delete_report_status(data["seed_id"]):
        return main_delete_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def user_move_seed_report(request):
    data =  request.data
    if  confirm_user(data["username"],data["seed_id"]):
        return move_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_move_seed_report(request,api_key):
    data =  request.data
    if confirm_api_key(api_key,data["seed_id"]):
        return move_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_update_seed_report(request,api_key,status):
    data =  request.data
    if confirm_api_exist(api_key) and confirm_api_key(api_key,data["seed_id"]):
        return update_seed_report(data) if status == "update" else delete_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)
    

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def user_update_delete_seed_report(request,status):
    data =  request.data
    if check_status(status) and confirm_user(data["username"],data["seed_id"]):
        return update_seed_report(data) if status == "update" else delete_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)
    
@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def agency_update_seed_report(request,status):
    data =  request.data
    if  check_status(status) and cconfirm_agency(data["agency"],data["seed_id"]):
        if status == "update":
            return update_seed_report(data)  
        elif status == "create":
            return create_seed_report(data)  
        else:
            delete_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def inspector_update_seed_report(request,status):
    data =  request.data
    if  check_status(status) and confirm_inspector(data["inspector"],data["seed_id"]):
        if status == "update":
            return update_seed_report(data)  
        elif status == "create":
            return create_seed_report(data)
        else:
            return delete_seed_report(data) 
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def agency_update_inspector_report(request):
    data =  request.data
    if  confirm_agency_inspector(data["agency"],data["inspector"]):
        return inspector_record(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def agency_update_agency_report(request):
    data =  request.data
    if  confirm_agency(data["agency"],data["agency_p"]):
        return agency_record(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def agency_agency_record(request):
    data =  request.data
    if  confirm_user_as_agency(data["agency"],data["username"]):
        data["agency_p"] = data["agency"]
        return agency_record(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def inspector_inspector_record(request):
    data =  request.data
    if  confirm_user_as_inspector(data["inspector"],data["username"]):
        return inspector_record(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def user_create_seed_report(request):
    data =  request.data
    if confirm_user_exist(data["username"]):
        return create_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_create_seed_report(request,api_key):
    data =  request.data
    if confirm_api_exist(api_key):
        data["username"] = get_api_owner(api_key)
        return create_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def user_seed_track_records(request):
    data =  request.data
    if confirm_user_exist(data["username"]):
        return seed_track_records(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_seed_track_records(request,api_key):
    data =  request.data
    if confirm_api_exist(api_key):
        return seed_track_records(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_key_generation(request):
   response = generate_api_key(request)
   return response
    
@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_key_change(request):
   response = change_api_key(request.data)
   return response

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_key_change_status(request,status):
   response = change_api_key_status(request.data,status)
   return response                                    

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def main_get_full_seed_report(request,seed_id):
   response = get_full_seed_report(seed_id)
   return response  

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def main_get_full_inspector_details(request,inspector):
   response = get_full_inspector_details(inspector)
   return response   

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def api_key_delete(request):
   response = delete_api_key(request.data)
   return response                                    

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def main_get_full_agency_details(request,agency):
   response = get_full_agency_details(agency)
   return response   

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def main_get_full_old_seed_details(request,seed_id):
   response = get_full_old_seed_details(seed_id)
   return response   

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def main_get_full_seed_track_details(request,seed_id):
   response = get_full_seed_track_details(seed_id)
   return response   

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def main_get_full_entity_seed_details(request,entity):
   response = get_full_entity_seed_details(entity)
   return response   

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_approve_reject_seed_report(request):
    data =  request.data
    if cconfirm_agency(data["agency"],data["seed_id"]):
        return approve_reject_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_approve_reject_agency(request):
    data =  request.data
    if confirm_agency(data["agency"],data["agency_p"]):
        return approve_reject_agency(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_approve_reject_inspector(request):
    data =  request.data
    if confirm_agency_inspector(data["agency"],data["inspector"]):
        return approve_reject_inspector(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_unapprove_reject_seed_report(request):
    data =  request.data
    if cconfirm_agency(data["agency"],data["seed_id"]):
        return unapprove_reject_seed_report(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_unapprove_reject_agency(request):
    data =  request.data
    if confirm_agency(data["agency"],data["agency_p"]):
        return unapprove_reject_agency(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_unapprove_reject_inspector(request):
    data =  request.data
    if confirm_agency_inspector(data["agency"],data["inspector"]):
        return unapprove_reject_inspector(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_delete_agency_record(request):
    data =  request.data
    if  confirm_user_as_agency(data["agency"],data["username"]):
        data["agency_p"] = data["agency"]
        return delete_agency_record(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def main_delete_inspector_record(request):
    data =  request.data
    if  confirm_user_as_inspector(data["inspector"],data["username"]):
        return delete_inspector_record(data)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def main_get_api_key(request,owner):
   response = get_api_key(owner)
   return response
    
@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def getlocked_by(request,seed_id):
   response = get_locked_by(seed_id)
   return response

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def getuser_label(request,username):
   response = get_user_label(username)
   return response


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def getinspector_pending_seed_reports(request):
   response = get_inspector_pending_seed_reports()
   return response

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def agencypending_seed_reports(request):
   response = get_agency_pending_seed_reports()
   return response


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def getuser_seed_reports(request,username):
   response = get_user_seed_reports(username)
   return response


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def get_inspector_recordsStatus(request,inspector,username):
    if  confirm_user_as_inspector(inspector,username):
        return get_inspector_records_status(username)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def get_agency_recordsStatus(request,agency,username):
    if  confirm_user_as_agency(agency,username):
        return get_agency_records_status(username)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def get_inspectorRecords(request,agency,status):
    if  agency_status(agency):
        return get_inspector_records(status)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def get_agencyRecords(request,agency,status):
    if  agency_status(agency):
        return get_agency_records(status)
    else:
        return Response({"msg" : "NOT PERMITTED"}, status=406)


