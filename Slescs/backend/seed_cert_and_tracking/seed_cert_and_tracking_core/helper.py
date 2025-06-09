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


def check_user_exist(username):
    return True

def get_api_owner(api_key):
    api_record = ApiKeyRecords.objects.filter(api_key=api_key).first()
    return api_record.owner


def confirm_user(username,seed_id):
    mseed = SeedReportRecords.objects.filter(seed_id=seed_id).first()
    flag = False
    if mseed is not None:
        if mseed.owner == username:
            flag = True
    return flag

def confirm_agency(agency,agency_p):
    magency = AgencyRecords.objects.filter(agency=agency_p).first()
    flag = False
    if magency is not None:
        store = loads(magency.record)
        if store.get("lockedby",None) is not None:
            if store["locked"]:
                if store["lockedby"]["who"] == agency and (True or agency_status(agency)):
                    flag = True
            else:
                flag = True
        else:
            flag = True 
    return flag

def agency_status(agency):
    magency = AgencyRecords.objects.filter(agency=agency).first()
    flag = False
    if magency is not None:
        if magency.status == "approved":
            flag = True
    return flag 


def inspector_status(inspector):
    minspector = InspectorRecords.objects.filter(inspector=inspector).first()
    flag = False
    if minspector is not None:
        if minspector.status == "approved":
            flag = True
    return flag 

def confirm_inspector(inspector,seed_id):
    seed = SeedReportRecords.objects.filter(seed_id=seed_id).first()
    flag = False
    if seed is not None:
        store = loads(seed.seed_report)
        if store.get("lockedby",None) is not None:
            if store["locked"]:
                if store["lockedby"]["who"] == inspector and inspector_status(inspector):
                    flag = True
            else:
                flag = True
        else:
            flag = True 
    return flag


def cconfirm_agency(agency,seed_id):
    seed = SeedReportRecords.objects.filter(seed_id=seed_id).first()
    flag = False
    if seed is not None:
        store = loads(seed.seed_report)
        if store.get("lockedby",None) is not None:
            if store["locked"]:
                if store["lockedby"]["who"] == agency and agency_status(agency):
                    flag = True
            else:
                flag = True
        else:
            flag = True 
    return flag


def confirm_agency_inspector(agency,inspector):
    minspector = InspectorRecords.objects.filter(inspector=inspector).first()
    flag = False
    if minspector is not None:
        store = loads(minspector.record)
        if store.get("lockedby",None) is not None:
            if store["locked"]:
                if store["lockedby"]["who"] == agency and (True or agency_status(agency)):
                    flag = True
            else:
                flag = True
        else:
            flag = True 
    return flag

def location():
    pass

def confirm_user_as_agency(agency,username):
    magency = AgencyRecords.objects.filter(agency=agency).first()
    flag = False
    if magency is not None:
        if magency.agency == username:
            flag = True 
    else:
        flag = True
    return flag


def confirm_user_as_inspector(inspector,username):
    minspector = InspectorRecords.objects.filter(inspector=inspector).first()
    flag = False
    if minspector is not None:
        if minspector.inspector == username:
            flag = True 
    else:
        flag = True
    return flag

def confirm_api_key(api_key,seed_id):
    seed_store = SeedReportRecords.objects.filter(seed_id=seed_id).first()
    api_store = ApiKeyRecords.objects.filter(api_key=api_key).first()
    flag = False
    if api_store is not None:
        if seed_store is not None:
            if seed_store.owner == api_store.owner:
                flag = True 
    return flag

def check_seed_delete_report_status(seed_id):
    seed_store = SeedReportRecords.objects.filter(seed_id=seed_id).first()
    flag = False
    if seed_store is not None:
        if seed_store.status not in ["deleted","approved","submitted"]:
            flag = True 
    return flag

def confirm_user_exist(username):
    return True

def confirm_api_exist(api_key):
    api_store = ApiKeyRecords.objects.filter(api_key=api_key).first()
    flag = False
    if api_store is not None:
        if api_store.status == "active":
            flag = True 
    return flag

def inspector_record(data):
    mstore = InspectorRecords.objects.filter(inspector=data["inspector"]).first()
    if mstore is not None:
        store = loads(mstore.record)
        kp = True
    else:
        mstore = {}
        store = None
        kp = False
    store = sc.inspector_info(data=data["data"],store=store)
    if kp:
        mstore.record = dumps(store)
        mstore.status = store["status"]
        mstore.save()
    else:
        mstore["inspector"] = data["inspector"]
        mstore["record"] = dumps(store)
        mstore["status"] = store["status"]
        serializer = InspectorRecordsSerializer(data=mstore)
        if serializer.is_valid():
            serializer.save()
    return Response({"msg":"SAVED"}, status=201)  


def agency_record(data):
    mstore = AgencyRecords.objects.filter(agency=data["agency_p"]).first()
    if mstore is not None:
        store = loads(mstore.record)
        kp = True
    else:
        mstore = {}
        store = None
        kp = False
    store = sc.agency_info(data=data["data"],store=store)
    if kp:
        mstore.record = dumps(store)
        mstore.status = store["status"]
        mstore.save()
    else:
        mstore["agency"] = data["agency"]
        mstore["record"] = dumps(store)
        mstore["status"] = store["status"]
        serializer = AgencyRecordsSerializer(data=mstore)
        if serializer.is_valid():
            serializer.save()
    return Response({"msg":"SAVED"}, status=201)  
                      

def user_record(data):
    mstore = UserRecords.objects.filter(username=data["username"]).first()
    if mstore is not None:
        store = loads(mstore.records)
        kp = True
    else:
        mstore = {}
        store = None
        kp = False
    store = sc.user_info(data=data["data"],store=store)
    if kp:
        mstore.record = dumps(store)
        mstore.save()
    else:
        mstore["username"] = data["username"]
        mstore["records"] = dumps(store)
        mstore["status"] = "active"
        serializer = UserRecordsSerializer(data=mstore)
        if serializer.is_valid():
            serializer.save()
    return Response({"msg":"SAVED"}, status=201)  

def get_user_record(username):
    mstore = UserRecords.objects.filter(username=username).first()
    if mstore is not None:
        store = loads(mstore.records)
        return Response({"msg":store}, status=200)  
    else:
        return Response({"msg":"RECORD NOT FOUND"}, status=404)  

def create_seed_report(data):
    mdata = data["data"]
    if data.get("seed_id",None) is not None:
        seed = SeedReportRecords.objects.filter(seed_id=data["seed_id"]).first()
        if seed is not None:
            store = loads(seed.seed_report)
            store = sc.seed_report(data=mdata,store=store)
            print("store: ",store)
            status =  store["status"]
            seed.seed_report = dumps(store)
            seed.status = status
            seed.save()
            return Response({"msg" : "UPDATED"}, status=201)
        else:
            id_ = data["seed_id"]
            return Response({"msg" : f"Seed ID {id_} NOT FOUND"}, status=404)
    else:
        id_ = sc.generate_id()
        store = sc.seed_report(data=mdata,store=None)
        status =  store["status"]
        store = dumps(store)
        main_store = {}
        main_store["seed_id"] = id_
        main_store["seed_report"] = store
        main_store["status"] = status
        main_store["owner"] = data["username"]
        serializer = SeedReportRecordsSerializer(data=main_store)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response({"error" : serializer.errors}, status=406)
    return Response({"msg" : f"Seed ID {id_}"}, status=201)

def update_seed_report(data):
    mdata = data["data"]
    seed = SeedReportRecords.objects.filter(seed_id=data["seed_id"]).first()
    if seed is not None:
        store = loads(seed.seed_report)
        store = sc.update_seed_report(data=mdata,store=store)
        status =  store["status"]
        seed.seed_report = dumps(store)
        seed.status = status
        seed.save()
        return Response({"msg" : "UPDATED"}, status=201)
    else:
        id_ = data["seed_id"]
        return Response({"msg" : f"Seed ID {id_} NOT FOUND"}, status=404)


def check_status(status):
    if status in ["update","delete","create"]:
        return True
    return False

def delete_seed_report(data):
    id_ = data["seed_id"]
    seed = SeedReportRecords.objects.filter(seed_id=data["seed_id"]).first()
    if seed is not None:
        store = loads(seed.seed_report)
        store = sc.delete_seed_report(data=data["data"],store=store)
        status =  store["status"]
        seed.seed_report = dumps(store)
        seed.status = status
        seed.save()
        return Response({"msg" : "DELETED"}, status=200)
    else:
        return Response({"msg" : f"Seed ID {id_} NOT FOUND"}, status=404)


def move_seed_report(data):
    id_ = data["seed_id"]
    seed = SeedReportRecords.objects.filter(seed_id=data["seed_id"]).first()
    mseed = OldSeedReportRecords.objects.filter(seed_id=data["seed_id"]).first()
    if seed is not None:
        if  mseed is not None:
            mstore = loads(mseed.seed_report)
            kp = True
        else:
            mseed = {}
            mstore = None
            kp = False
        store = loads(seed.seed_report)
        mstore = sc.old_seed_report(report=store,store=mstore)
        if kp:
            mseed.seed_report = dumps(mstore)
            mseed.save()
            return Response({"msg" : "SAVED"}, status=201)  
        else:
            mseed["seed_id"] = id_
            mseed["seed_report"] = dumps(mstore)
            mseed["status"] = "active"
            serializer = OldSeedReportRecordsSerializer(data=mseed)
            if serializer.is_valid():
                serializer.save()
            return Response({"msg" : "SAVED"}, status=201)  
    else:
        return Response({"msg" : f"Seed ID {id_} NOT FOUND"}, status=404)


def main_delete_seed_report(data):
    seed = SeedReportRecords.objects.filter(seed_id=data["seed_id"]).first()
    if seed is not None:
        seed.delete()
    return Response({"msg" : "DELETED"}, status=201)  



def en_store(id_,username,data,main):
    eseed = EntitySeedRecords.objects.filter(entity=username).first()
    if eseed is not None:
        store_ = loads(eseed.entity_seed_records)
        kp_ = True
    else:
        eseed = {}
        store_ = None
        kp_ = False
    
    info = sc.build_seed_nav(seed_id=id_,prev_seed_id=data["from_owner"],me=data["to_owner"],date=data["date"],info=data.get("info",None))
    store_ = sc.seed_records(seed_id=id_,main=main,info=info,date=data["date"],store=store_)
    if kp_:
        eseed.entity_seed_records = dumps(store_)
        eseed.save()
    else:
        eseed["entity"] = username
        eseed["entity_seed_records"] = dumps(store_)
        serializer = EntitySeedRecordsSerializer(data=eseed)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response({"error": serializer.errors},status=406)


def seed_track_records(data):
    id_ = data["seed_id"]
    mseed = SeedTrackRecords.objects.filter(seed_id=data["seed_id"]).first()
    if mseed is not None:
        store = loads(mseed.record)
        kp = True
    else:
        mseed = {}
        store = None
        kp = False

    store,s_store,store_hash = sc.trackbility(seed_id=id_,from_owner=data["from_owner"],to_owner=data["to_owner"],inspector=data["inspector"],date=data["date"],store=store)
    if kp:
        mseed.record = s_store
        mseed.save()
    else:
        mseed["seed_id"] = id_
        mseed["record"] = s_store
        serializer = SeedTrackRecordsSerializer(data=mseed)
        if serializer.is_valid():
            serializer.save()
    en_store(id_=id_,username=data["to_owner"],data=data,main=False)
    en_store(id_=id_,username=data["from_owner"],data=data,main=True)
    
    return Response({"msg" : "SAVED"}, status=201)  

def generate_api_key(request):
    data = request.data
    api_record = ApiKeyRecords.objects.filter(owner=data["owner"]).first()
    if api_record is None:
        pack,_ = sc.generate_api_key(data["owner"])
        api_key =  [i for i in pack.keys()][0]
        api_record = {}
        api_record["owner"] = data["owner"]
        api_record["api_key"] = api_key
        api_record["record"] = dumps(pack)
        api_record["status"] = "active"
        serializer = ApiKeyRecordsSerializer(data=api_record)
        if serializer.is_valid():
            serializer.save()
    else:
        api_key = api_record.api_key
    return Response({"msg":api_key}, status=200)

def change_api_key(data):
    api_record = ApiKeyRecords.objects.filter(owner=data["owner"]).first()
    if api_record is not None:
        if data["owner"] != data["username"]:
            return Response({"msg":"Not permitted"}, status=406)
        pack,msg = sc.generate_api_key(data["owner"])
        api_key =  [i for i in pack.keys()][0]
        api_record.api_key = api_key
        api_record.record = dumps(pack)
        api_record.status = "active"
        api_record.save()
        return Response({"msg":api_key}, status=200)
    else:
        return Response({"msg":"RECORD NOT FOUND"}, status=404)

def change_api_key_status_l(status):
    flag = False
    if status in ["active","revoke"]:
        flag = True
    return flag

def change_api_key_msg(status):
    msg = "pending"
    if status == "revoke":
        msg = "revoked"
    elif status == "active":
        msg = "activated"
    else:
        pass
    return msg

def change_api_key_status(data,status):
    api_record = ApiKeyRecords.objects.filter(owner=data["owner"]).first()
    if api_record is not None:
        if data["owner"] != data["username"]:
            return Response({"msg":"NOT PERMITTED"}, status=406)
        if change_api_key_status_l(status):
            api_record.status = status
            api_record.save()
        return Response({"msg":change_api_key_msg(status)}, status=200)
    else:
        return Response({"msg":"KEY NOT FOUND"}, status=404)

def delete_api_key(request):
    data = request.data
    api_record = ApiKeyRecords.objects.filter(owner=data["owner"]).first()
    if api_record is not None:
        if data["owner"] != data["username"]:
            return Response({"msg":"NOT PERMITTED"}, status=406)
        api_record.delete()
    return Response({"msg":"DELETED"}, status=200)


def get_full_seed_report(seed_id):
    seed = SeedReportRecords.objects.filter(seed_id=seed_id).first()
    if seed is not None:
        store = loads(seed.seed_report)
        return Response({"msg":store},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)


def get_full_inspector_details(inspector):
    minspector = InspectorRecords.objects.filter(inspector=inspector).first()
    if minspector is not None:
        store = loads(minspector.record)
        return Response({"msg":store},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)

def get_full_agency_details(agency):
    magency = AgencyRecords.objects.filter(agency=agency).first()
    if magency is not None:
        store = loads(magency.record)
        return Response({"msg":store},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)

def get_full_old_seed_details(seed_id):
    mseed = OldSeedReportRecords.objects.filter(seed_id=seed_id).first()
    if mseed is not None:
        store = loads(mseed.seed_report)
        return Response({"msg":store},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)

def get_full_seed_track_details(seed_id):
    mseed = SeedTrackRecords.objects.filter(seed_id=seed_id).first()
    if mseed is not None:
        store = loads(mseed.record)
        return Response({"msg":store},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)

def get_full_entity_seed_details(entity):
    eseed = EntitySeedRecords.objects.filter(entity=entity).first()
    if eseed is not None:
        store = loads(eseed.entity_seed_records)
        return Response({"msg":store},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)

def approve_reject_seed_report(data):
    seed = SeedReportRecords.objects.filter(seed_id=data["seed_id"]).first()
    if seed is not None:
        store = loads(seed.seed_report)
        msg,flag,store = sc.approve_reject(store=store,inspector=data["inspector"],date=data["date"],typ_=data["type"],cnt=data["count"])
        if flag:
            status =  store["status"]
            seed.seed_report = dumps(store)
            seed.status = status
            seed.save()
            return Response({"msg" :msg}, status=201)
        else:
            return Response({"msg":msg},status=406)
    else:
        id_ = data["seed_id"]
        return Response({"msg" :f"Seed ID {id_} NOT FOUND"}, status=404)


def approve_reject_agency(data):
    magency = AgencyRecords.objects.filter(agency=data["agency_p"]).first()
    if magency is not None:
        store = loads(magency.record)
        msg,flag,store = sc.approve_reject(store=store,inspector=data["agency"],date=data["date"],typ_=data["type"],cnt=data["count"])
        if flag:
            status =  store["status"]
            magency.record = dumps(store)
            magency.status = status
            magency.save()
            return Response({"msg":msg}, status=201)
        else:
            return Response({"msg":msg},status=406)
    else:
        return Response({"msg":"RECORD NOT FOUND"}, status=404)

def approve_reject_inspector(data):
    minspector = InspectorRecords.objects.filter(inspector=data["inspector"]).first()
    if minspector is not None:
        store = loads(minspector.record)
        msg,flag,store = sc.approve_reject(store=store,inspector=data["agency"],date=data["date"],typ_=data["type"],cnt=data["count"])
        if flag:
            status =  store["status"]
            minspector.record = dumps(store)
            minspector.status = status
            minspector.save()
            return Response({"msg" : msg}, status=201)
        else:
            return Response({"msg":msg},status=406)
    else:
        return Response({"msg":"RECORD NOT FOUND"}, status=404)

def unapprove_reject_seed_report(data):
    seed = SeedReportRecords.objects.filter(seed_id=data["seed_id"]).first()
    if seed is not None:
        store = loads(seed.seed_report)
        store = sc.unapprove_reject(store=store,inspector=data["inspector"],typ_=data["type"])
        status =  store["status"]
        seed.seed_report = dumps(store)
        seed.status = status
        seed.save()
        return Response({"msg" : "SUCCESS"}, status=201)
    else:
        id_ = data["seed_id"]
        return Response({"msg" :f"Seed ID {id_} NOT FOUND"}, status=404)


def unapprove_reject_agency(data):
    magency = AgencyRecords.objects.filter(agency=data["agency_p"]).first()
    if magency is not None:
        store = loads(magency.record)
        store = sc.unapprove_reject(store=store,inspector=data["agency"],typ_=data["type"])
        status =  store["status"]
        magency.record = dumps(store)
        magency.status = status
        magency.save()
        return Response({"msg" : "SUCCESS"}, status=201)
    else:
        return Response({"msg":"RECORD NOT FOUND"}, status=404)

def unapprove_reject_inspector(data):
    minspector = InspectorRecords.objects.filter(inspector=data["inspector"]).first()
    if minspector is not None:
        store = loads(minspector.record)
        store = sc.unapprove_reject(store=store,inspector=data["agency"],typ_=data["type"])
        status =  store["status"]
        minspector.record = dumps(store)
        minspector.status = status
        minspector.save()
        return Response({"msg" : "SUCCESS"}, status=201)
    else:
        return Response({"msg":"RECORD NOT FOUND"}, status=404)

def updatemodelrecord(class_,data):
    for i,v in data.items():
        if hasattr(class_,i):
            setattr(class_,i,v)
    return class_


def delete_inspector_record(data):
    mstore = InspectorRecords.objects.filter(inspector=data["inspector"]).first()
    if mstore is not None:
        if mstore.status == "approved":
            return Response({"msg":"CAN'T BE DELETED"}, status=406) 
        mstore.delete()
    return Response({"msg":"DELETED"}, status=200)  


def delete_agency_record(data):
    mstore = AgencyRecords.objects.filter(agency=data["agency_p"]).first()
    if mstore is not None:
        if mstore.status == "approved":
            return Response({"msg":"CAN'T BE DELETED"}, status=406) 
        mstore.delete()
    return Response({"msg":"DELETED"}, status=200)  

def get_api_key(owner):
    api_record = ApiKeyRecords.objects.filter(owner=owner).first()
    if api_record is not None:
        return Response({"msg":loads(api_record.record)}, status=200)
    else:
        return Response({"msg" :"RECORD NOT FOUND"}, status=404)


def get_locked_by(seed_id):
    mseed = SeedReportRecords.objects.filter(seed_id=seed_id).first()
    if mseed is not None:
        store = loads(mseed.seed_report)
        if len(store["lockedby"]):
            flag,lockedby = True,store["lockedby"] 
        else:
            flag,lockedby =  False,{}
        store_  = {}
        store_["locked"] = flag
        store_["info"] = lockedby
        return Response({"msg":store_},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)


def get_user_label(username):
    urecord = UserRecords.objects.filter(username=username).first()
    if urecord is not None:
        store = loads(urecord.records)
        label = store["label"]
        return Response({"msg":label},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)


def get_inspector_pending_seed_reports():
    urecord = SeedReportRecords.objects.filter(status="INSPECTOR")
    if urecord is not None:
        pst_ = []
        for i in urecord:
            st_ = {}
            st_["seed_id"] = i.seed_id
            st_["owner"] = i.owner
            st_["seed_report"] = loads(i.seed_report)
            st_["status"] = i.status
            st_["created"] = i.created
            pst_.append(st_)
        return Response({"msg":pst_},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)


def get_agency_pending_seed_reports():
    urecord = SeedReportRecords.objects.filter(status="AGENCY")
    if urecord is not None:
        pst_ = []
        for i in urecord:
            st_ = {}
            st_["seed_id"] = i.seed_id
            st_["owner"] = i.owner
            st_["seed_report"] = loads(i.seed_report)
            st_["status"] = i.status
            st_["created"] = i.created
            pst_.append(st_)
        return Response({"msg":pst_},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)


def get_user_seed_reports(username):
    urecord = SeedReportRecords.objects.filter(owner=username)
    if urecord is not None:
        pst_ = []
        for i in urecord:
            st_ = {}
            st_["seed_id"] = i.seed_id
            st_["owner"] = i.owner
            st_["seed_report"] = loads(i.seed_report)
            st_["status"] = i.status
            st_["created"] = i.created
            pst_.append(st_)
            print(st_)
        return Response({"msg":pst_},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)


def get_inspector_records(status):
    urecord = InspectorRecords.objects.filter(status=status)
    if urecord is not None:
        pst_ = []
        for i in urecord:
            st_ = {}
            st_["inspector"] = i.inspector
            st_["record"] = loads(i.record)
            st_["created"] = i.created
            pst_.append(st_)
            print(st_)
        return Response({"msg":pst_},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)


def get_inspector_records_status(username):
    urecord = InspectorRecords.objects.filter(inspector=username).first()
    if urecord is not None:
        return Response({"msg":urecord.status},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)


def get_agency_records(status):
    urecord = AgencyRecords.objects.filter(status=status)
    if urecord is not None:
        pst_ = []
        for i in urecord:
            st_ = {}
            st_["agency"] = i.agency
            st_["record"] = loads(i.record)
            st_["status"] = i.status
            st_["created"] = i.created
            pst_.append(st_)
            print(st_)
        return Response({"msg":pst_},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)

def get_agency_records_status(username):
    urecord = AgencyRecords.objects.filter(agency=username)
    if urecord is not None:
        return Response({"msg":urecord.status},status=200)
    return Response({"error":"RECORD NOT FOUND"},status=404)



