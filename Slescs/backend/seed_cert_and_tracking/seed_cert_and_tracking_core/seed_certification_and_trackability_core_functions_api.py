from . import seed_certification_and_trackability_core_functions as sc


def generate_id():
    return sc.generate_id()


def seed_report(data,store=None):
    store = sc.seed_report(data,store)
    return store


def update_seed_report(data,store):
    store = sc.update_seed_report(data,store)
    return store

def delete_seed_report(data,store):
    store = sc.delete_seed_report(data,store)
    return store


def old_seed_report(report,store=None):
    store = sc.old_seed_report(report,store)
    return store


def seed_records(seed_id,main,info,date,store=None):
    store = sc.seed_records(seed_id,main,info,date,store)
    return store


def build_seed_nav(seed_id,prev_seed_id,me,date,info=None):
    info = sc.build_seed_nav(seed_id,prev_seed_id,me,date,info)
    return info


def trackbility(seed_id,from_owner,to_owner,inspector,date,store=None):
    store,s_store,store_hash = sc.trackbility(seed_id,from_owner,to_owner,inspector,date,store)
    return store,s_store,store_hash


def get_owner_track(store,seed_id, final_owner):
    tracks = sc.get_owner_track(store,seed_id, final_owner)
    return tracks


def seed_authenication(store):
    status = sc.seed_authenication(store)
    return status

def inspector_info(data,store=None):
    store = sc.inspector_info(data,store)
    return store

def agency_info(data,store=None):
    store = sc.agency_info(data,store)
    return store


def inspectors_verification_info(data,store):
    store = sc.inspectors_verification_info(data,store)
    return store

def agency_verification_info(data,store):
    store = sc.agency_verification_info(data,store)
    return store


def user_info(data,store):
    store = sc.user_info(data,store)
    return store

def generate_api_key(owner):
    pack,msg = sc.generate_api_key(owner)
    return pack,msg

def approve_reject(store,inspector,date,typ_,cnt):
    msg,flag,store = sc.approve_reject(store,inspector,date,typ_,cnt)
    return msg,flag,store


def unapprove_reject(store,inspector,typ_):
    store = sc.unapprove_reject(store,inspector,typ_)
    return store

def striaghtcontent(store):
    store = sc.striaghtpack(store)
    return store

