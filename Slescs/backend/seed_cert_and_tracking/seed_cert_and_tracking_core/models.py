import uuid

from django.db import models
from django.contrib.auth.models import User
# Create your models here.

#remigrate dhix model,cuz i made some changes

class SeedReportRecords(models.Model):
    """DB SChema"""
    
    seed_id = models.CharField(max_length=2000,unique=True,primary_key=True)
    owner = models.CharField(max_length=2000)
    seed_report = models.TextField()
    status = models.CharField(max_length=2000)
    created = models.DateTimeField(auto_now=True)

class SeedTrackRecords(models.Model):
    """DB SChema"""
    
    seed_id = models.CharField(max_length=2000,unique=True,primary_key=True)
    record = models.TextField()
    created = models.DateTimeField(auto_now=True)


class OldSeedReportRecords(models.Model):
    """DB SChema"""
    
    seed_id = models.CharField(max_length=2000,unique=True,primary_key=True)
    seed_report = models.TextField()
    created = models.DateTimeField(auto_now=True)

class InspectorRecords(models.Model):
    """DB SChema"""
    
    inspector = models.CharField(max_length=2000,unique=True,primary_key=True)
    record = models.TextField()
    status = models.CharField(max_length=2000)
    created = models.DateTimeField(auto_now=True)

class AgencyRecords(models.Model):
    """DB SChema"""
    
    agency = models.CharField(max_length=2000,unique=True,primary_key=True)
    record = models.TextField()
    status = models.CharField(max_length=2000)
    created = models.DateTimeField(auto_now=True)


class EntitySeedRecords(models.Model):
    """DB SChema"""
    
    entity = models.CharField(max_length=2000,unique=True,primary_key=True)
    entity_seed_records = models.TextField()
    created = models.DateTimeField(auto_now=True)

class ApiKeyRecords(models.Model):
    """DB SChema"""
    
    owner = models.CharField(max_length=2000,unique=True,primary_key=True)
    api_key = models.CharField(max_length=2000,unique=True)
    record = models.TextField()
    status = models.CharField(max_length=2000)
    created = models.DateTimeField(auto_now=True)

class UserRecords(models.Model):
    """DB SChema"""
    
    username = models.CharField(max_length=2000,unique=True,primary_key=True)
    records = models.TextField()
    status = models.CharField(max_length=2000)
    created = models.DateTimeField(auto_now=True)



