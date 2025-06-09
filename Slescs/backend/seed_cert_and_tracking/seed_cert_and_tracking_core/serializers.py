from rest_framework.serializers import ModelSerializer
from .models import (SeedReportRecords,InspectorRecords,AgencyRecords,EntitySeedRecords,ApiKeyRecords,UserRecords,OldSeedReportRecords,SeedTrackRecords)


class SeedReportRecordsSerializer(ModelSerializer):
    '''Serializer For ChatRoom Model Objects'''

    class Meta:
        model = SeedReportRecords
        fields = "__all__"
        

class OldSeedReportRecordsSerializer(ModelSerializer):
    '''Serializer For ChatRoom Model Objects'''

    class Meta:
        model = OldSeedReportRecords
        fields = "__all__"
        
class SeedTrackRecordsSerializer(ModelSerializer):
    '''Serializer For ChatRoom Model Objects'''

    class Meta:
        model = SeedTrackRecords
        fields = "__all__"

class InspectorRecordsSerializer(ModelSerializer):
    '''Serializer For ChatRoom Model Objects'''

    class Meta:
        model = InspectorRecords
        fields = "__all__"
        
class AgencyRecordsSerializer(ModelSerializer):
    '''Serializer For ChatRoom Model Objects'''

    class Meta:
        model = AgencyRecords
        fields = "__all__"
        
class EntitySeedRecordsSerializer(ModelSerializer):
    '''Serializer For ChatRoom Model Objects'''

    class Meta:
        model = EntitySeedRecords
        fields = "__all__"
        
class ApiKeyRecordsSerializer(ModelSerializer):
    '''Serializer For ChatRoom Model Objects'''

    class Meta:
        model = ApiKeyRecords
        fields = "__all__"
        
class UserRecordsSerializer(ModelSerializer):
    '''Serializer For ChatRoom Model Objects'''

    class Meta:
        model = UserRecords
        fields = "__all__"
        
