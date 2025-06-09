import uuid
import hashlib
import json
import secrets
import string
from datetime import datetime



class MerkleTree:
    def __init__(self, transactions):
        self.transactions = transactions
        self.tree = []
        self.build_tree()

    def hash_data(self, data):
        return hashlib.sha256(data.encode()).hexdigest()

    def build_tree(self):
        nodes = [self.hash_data(tx) for tx in self.transactions]
        self.tree.append(nodes)

        while len(nodes) > 1:
            new_level = []
            for i in range(0, len(nodes), 2):
                if i + 1 < len(nodes):
                    combined_hash = self.hash_data(nodes[i] + nodes[i + 1])
                else:
                    combined_hash = nodes[i]  # Odd node case
                new_level.append(combined_hash)
            nodes = new_level
            self.tree.append(nodes)

    def get_root(self):
        return self.tree[-1][0] if self.tree else None


class SeedTrackingDAG:
    def __init__(self,graph={}):
        self.graph = graph

    def add_transaction(self, seed_id, from_owner, to_owner, inspector,date):
        """ Adds a seed transaction to the DAG """
        tx = {
            "seed_id": seed_id,
            "from": from_owner,
            "to": to_owner,
            "inspector": inspector,
            "date": date
            }
        tx_hash = hashlib.sha256(json.dumps(tx).encode()).hexdigest()

        if seed_id not in self.graph:
            self.graph[seed_id] = []
        
        self.graph[seed_id].append(tx)

        return tx_hash

    def get_seed_history(self, seed_id):
        """ Retrieves the movement history of a given seed """
        return self.graph.get(seed_id, [])

    def get_graph(self):
        """ Retrieves the movement history of a given seed """
        return self.graph


def trace_origin(dag, seed_id, final_owner):
    """
    Traces back the seed from the given final_owner to its origin.
    """
    history = dag.get_seed_history(seed_id)
    if not history:
        return "No history found for this seed."

    # Start tracing from the final owner
    trace_path = []
    current_owner = final_owner

    while current_owner:
        found = False
        for tx in reversed(history):  # Traverse in reverse order
            if tx["to"] == current_owner:
                trace_path.append(tx)
                current_owner = tx["from"]
                found = True
                break  # Move to the previous transaction
        
        if not found:
            break  # Stop if no further links are found

    trace_path.reverse()  # Reverse to show origin → destination
    return trace_path if trace_path else "NO TRACE FOUND FOR THIS OWNER."


def generate_id():
    return str(uuid.uuid4())

def seed_details():
    keys = ["seed_name","farm_name","seed_variety","region_state","harvest_date","farm_address","quantity","weight_per_1000_seed","additional_information"]
    return keys

def lab_details():
    keys = ["data","date"]
    return keys

def inspection_details():
    keys = ["date","data"]
    return keys


def inspection_data_details():
    keys = ["test_date","test_result","submission"]
    return keys

def certification_details():
    keys = []
    return keys


def general_seed_details():
    keys = ["seed_details","status","lab_details","lockedby"]
    return keys

def lab_data_details():
    keys = ["parameter1","parameter2","parameter3"]
    return keys

def getanything(store,key):
    return store.get(key,None)

def seed_report(data,store=None):
    if store is None:
        store = {}
    for i,v in data.items():
        if i in general_seed_details():
            if getanything(store,i) is None:
                store[i] = {}
            if i == "seed_details":
                for n,m in v.items():
                    if n in seed_details():
                        store[i][n] = m
            elif i == "lab_details":
                for n,m in v.items():
                    id_ = generate_id()
                    store[i][id_] = {} 
                    for x,y in m.items():
                        if x in lab_details():
                            if x == "data":
                                store[i][id_][x] = {}
                                for a,b in y.items():
                                    if a in lab_data_details():
                                        store[i][id_][x][a] = b 
                            else:
                                store[i][id_][x] = y

            elif i == "inspection_details":
                for n,m in v.items():
                    id_ = generate_id()
                    store[i][id_] = {} 
                    for x,y in m.items():
                        if x in inspection_details():
                            if x == "data":
                                store[i][id_][x] = {}
                                for a,b in y.items():
                                    if a in inspection_data_details():
                                        store[i][id_][x][a] = b 
                            else:
                                store[i][id_][x] = y
            elif i == "certification_details":
                for n,m in v.items():
                    if n in certification_details():
                        store[i][n] = m
            else:
                store[i] = v

        else:
            pass
    return store

def unupdate_status():
    status = ["deleted","approved"]
    return status

def all_status():
    status = []
    return status


def update_seed_report(data,store):
    if store is not None:
        if store["status"] not in unupdate_status():
            for i,v in data.items():
                if getanything(store,i) is None:
                    continue
                if i == "seed_details":
                    for n,m in v.items():
                        if getanything(store[i],n) is not None:
                            store[i][n] = m
                elif i == "lab_details":
                    for n,m in v.items():
                        if getanything(store[i],n) is None:
                            continue
                        for x,y in m.items():
                            if getanything(store[i][n],x) is None:
                                continue
                            if x == "data":
                                for a,b in y.items():
                                    if getanything(store[i][n][x],a) is None:
                                        continue
                                    store[i][n][x][a] = b 
                            else:
                                store[i][n][x] = y

                elif i == "inspection_details":
                    for n,m in v.items():
                        if getanything(store[i],n) is None:
                            continue
                        for x,y in m.items():
                            if getanything(store[i][n],x) is None:
                                continue
                            if x == "data":
                                for a,b in y.items():
                                    if getanything(store[i][n][x],a) is None:
                                        continue
                                    store[i][n][x][a] = b 
                            else:
                                store[i][n][x] = y
                elif i == "certification_details":
                    for n,m in v.items():
                        if getanything(store[i],n) is None:
                            continue
                        store[i][n] = m
                else:
                    store[i] = v

        else:
            pass

    return store


def delete_seed_report(data,store):
    if store is not None:
        if store["status"] not in unupdate_status():
            for i,v in data.items():
                if getanything(store,i) is None:
                    continue
                if i == "seed_details":
                    for n in v.keys():
                        if getanything(store[i],n) is not None:
                            store[i].pop(n)

                elif i == "lab_details":
                    for n in v.keys():
                        if getanything(store[i],n) is None:
                            continue
                        store[i].pop(n)

                elif i == "inspection_details":
                    for n in v.keys():
                        if getanything(store[i],n) is None:
                            continue
                        store[i].pop(n)

                elif i == "certification_details":
                    for n in v.keys():
                        if getanything(store[i],n) is None:
                            continue
                        store[i].pop(n)
                else:
                    store.pop(i)
        else:
            pass

    return store


def old_seed_report(report,store=None):
    if store is None:
        store = {}
    id_ = generate_id()
    store[id_] = {}
    store[id_]["date"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")  # UTC Timestamp
    store[id_]["seed_reports"] = report
    return store


def seed_records(seed_id,main,info,date,store=None):
    if store is None:
        store = {}
    if getanything(store,seed_id) is None:
        store[seed_id] = {}
        store[seed_id]["record"] = {}
    store[seed_id]["record"]["main"] = main
    store[seed_id]["record"]["date"] = date
    store[seed_id]["record"]["info"] = info
    return store


def build_seed_nav(seed_id,prev_seed_id,me,date,info=None):
    if info is None:
        info = {}
    if prev_seed_id != seed_id:
        if getanything(info,"other") is None:
            info["other"] = {}
            info["other_id"] = 1
        next_id = (info["other_id"] - 1)
        info["me"] = me
        info["origin"] = seed_id
        info["other"][next_id] = prev_seed_id
    return info

def trackbility(seed_id,from_owner,to_owner,inspector,date,store=None):
    if store is None:
        store = {}
    dag = SeedTrackingDAG(graph=store)
    # Adding seed transactions
    dag.add_transaction(seed_id=seed_id, from_owner=from_owner, to_owner=to_owner, inspector=inspector,date=date)
    store = dag.get_graph()
    s_store = json.dumps(store)

    # Retrieve transaction history
    seed_history = dag.get_seed_history(seed_id)

    # Create Merkle Tree for verification
    transactions = [json.dumps(tx) for tx in seed_history]
    merkle_tree = MerkleTree(transactions)
    store_hash = merkle_tree.get_root()
    return store,s_store,store_hash


def get_owner_track(store,seed_id, final_owner):
    dag = SeedTrackingDAG(graph=store)
    tracks = trace_origin(dag,seed_id, final_owner)
    return tracks


def seed_authenication(store):
    return store["status"]

def inspectors_details():
    keys = ["data1","data2","locked","lockedby","status"]
    return keys

def lockedby_details():
    keys = ["who","type"]
    return keys


def inspector_info(data,store=None):
    if store is None:
        store = {}
    for i,v in data.items():
        if i in inspectors_details():
            if i == "lockedby":
                store[i] = {}
                for n,m in v.items():
                    if n in lockedby_details():
                        store[i][n] = m
            else:
                store[i] = v
    return store


def agency_details():
    keys = ["data1","data2","locked","lockedby","status"]
    return keys

def agency_info(data,store=None):
    if store is None:
        store = {}
    for i,v in data.items():
        if i in agency_details():
            if i == "lockedby":
                store[i] = {}
                for n,m in v.items():
                    if n in lockedby_details():
                        store[i][n] = m
            else:
                store[i] = v
    return store


def inspectors_verification_details():
    keys = []
    return keys

def inspectors_verification_info(data,store):
    if store is None:
        store = {}
    for i,v in data.items():
        if i in inspectors_verification_details():
            store[i] = v
    return store


def agency_verification_details():
    keys = []
    return keys

def agency_verification_info(data,store):
    if store is None:
        store = {}
    for i,v in data.items():
        if i in agency_verification_details():
            store[i] = v
    return store


def user_details():
    keys = ["location","label","phone_number"]
    return keys

def user_info(data,store):
    if store is None:
        store = {}
    for i,v in data.items():
        if i in user_details():
            store[i] = v
    return store


class APIKeyManager:
    def __init__(self):
        self.api_keys = {}  

    def generate_api_key(self, owner):
        """
        Generates a unique API key that never expires, with a timestamp.
        """
        key = self._create_secure_key()
        date_issued = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")  # UTC Timestamp
        self.api_keys[key] = {"owner": owner, "date_issued": date_issued}
        return key, date_issued

    def _create_secure_key(self, length=32):
        """
        Creates a secure API key.
        """
        characters = string.ascii_letters + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))

    def validate_api_key(self, key):
        """
        Checks if an API key exists.
        """
        if key in self.api_keys:
            owner = self.api_keys[key]["owner"]
            date_issued = self.api_keys[key]["date_issued"]
            return True, f"API KEY VALID FOR {owner} (ISSUED ON {date_issued})"
        return False, "Invalid API Key"

    def revoke_api_key(self, key):
        """
        Revokes an API key.
        """
        if key in self.api_keys:
            del self.api_keys[key]
            return True, "API KEY REVOKED SUCCESSFULLY"
        return False, "API KEY NOT FOUND"

    def get_key_store(self):
        return self.api_keys

def generate_api_key(owner):
    api_manager = APIKeyManager()
    api_key, date_issued = api_manager.generate_api_key(owner)
    msg = f"GENERATED API KEY: {api_key} (ISSUED ON {date_issued})"
    return api_manager.get_key_store(),msg


def apprej_status():
    return ["approve","reject"]

def check_count(store,cnt):
    ccnt = len(store.keys())
    return ccnt == cnt

def approve_reject_status(store,inspector):
    return inspector in store.keys()
    
def approve_reject(store,inspector,date,typ_,cnt):
    if getanything(store,"stopped") is not None:
        if store["stopped"]:
            return "CONCLUDED",False,store

    if typ_ not in apprej_status():
        return "INVALID STATUS",False,store

    if typ_ == "approve":
        app = "approvedby"
        app_ = "approved"
    else:
        app = "rejectedby"
        app_ = "rejected"
    
    if approve_reject_status(store[app],inspector):
        return f"{app_} BEFORE",False,store

    if getanything(store,app) is None:
        store[app] = {}

    store[app][inspector] = {}
    store[app][inspector]["date"] = date

    if check_count(store[app],cnt):
        store["stopped"] = True
        store[app_] = True

    if getanything(store,app_) is not None and getanything(store,app_):
        store["status"] = app_
    return f"{app_}",True,store


def arsection(typ_):
    return "approvedby" if typ_ == "approve" else "rejectedby"
  
def unapprove_reject(store,inspector,typ_):
    if typ_  in apprej_status():
        if getanything(store,arsection(typ_)) is not None:
            if getanything(store[arsection(typ_)],inspector) is not None:
                store[arsection(typ_)].pop(inspector)
    return store

def striaghtpack(item):
    trans = None
    return trans
          








