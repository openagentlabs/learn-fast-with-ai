# 🚀 GKE Pod Management - Complete Command Reference

This document contains all the kubectl commands used to deploy and manage a Next.js application on Google Kubernetes Engine (GKE).

---

## 📋 Table of Contents

1. [Prerequisites & Verification](#-prerequisites--verification)
2. [Finding Your Container Image](#-finding-your-container-image)
3. [Deploying a Pod](#-deploying-a-pod)
4. [Checking Pod Status](#-checking-pod-status)
5. [Exposing the Application Publicly](#-exposing-the-application-publicly)
6. [Testing the Application](#-testing-the-application)
7. [Cleanup Commands](#-cleanup-commands)

---

## ✅ Prerequisites & Verification

### 1. Verify kubectl Installation

Check if kubectl is installed and access cluster:

```bash
kubectl version --client
```

**Output:**
```
Client Version: v1.33.5-dispatcher
Kustomize Version: v5.6.0
```

### 2. Check Existing Pods

Verify access to the cluster and check for existing pods:

```bash
kubectl get pods
```

**Expected Output:**
```
No resources found in default namespace.
```

---

## 🏗️ Finding Your Container Image

### 1. Get GCP Project ID

Find which GCP project you're currently using:

```bash
gcloud config get-value project
```

### 2. List Artifact Registry Repositories

Find your container repositories:

```bash
gcloud artifacts repositories list --format="table(name,format,location)"
```

**Output:**
```
REPOSITORY         FORMAT  LOCATION
nextjs-containers  DOCKER
```

### 3. Get Detailed Repository Information

Get full details including location:

```bash
gcloud artifacts repositories list --format="yaml"
```

**Location Found:** `europe-west2`

### 4. List Container Images

Find your container images with tags:

```bash
gcloud artifacts docker images list europe-west2-docker.pkg.dev/keithtest001/nextjs-containers --include-tags --format="table(package,tags)"
```

**Example Output:**
```
IMAGE                                                                          TAGS
europe-west2-docker.pkg.dev/keithtest001/nextjs-containers/learn-fast-with-ai  df1418e37983b19b0e62c4550cd0e1e2301f3bd6
```

---

## 🚀 Deploying a Pod

### Create a Pod with Your Container

Deploy a single pod instance using your container image:

```bash
kubectl run learn-fast-with-ai --image=europe-west2-docker.pkg.dev/keithtest001/nextjs-containers/learn-fast-with-ai:df1418e37983b19b0e62c4550cd0e1e2301f3bd6 --port=3000
```

**Parameters:**
- `learn-fast-with-ai` - Pod name
- `--image` - Full container image path with tag
- `--port` - Container port (3000 for Next.js)

**Expected Output:**
```
Warning: autopilot-default-resources-mutator:Autopilot updated Pod default/learn-fast-with-ai: defaulted unspecified 'cpu' resource for containers [learn-fast-with-ai] (see http://g.co/gke/autopilot-defaults).
pod/learn-fast-with-ai created
```

---

## 📊 Checking Pod Status

### 1. Check Basic Pod Status

View all pods and their current status:

```bash
kubectl get pods
```

**Output:**
```
NAME                 READY   STATUS    RESTARTS   AGE
learn-fast-with-ai   1/1     Running   0          28s
```

**Status Meanings:**
- `ContainerCreating` - Pod is being created and image is being pulled
- `Running` - Pod is successfully running
- `Ready: 1/1` - Container is healthy and ready to accept traffic

### 2. Get Detailed Pod Information

View extended pod information including IP and Node:

```bash
kubectl get pods -o wide
```

**Output:**
```
NAME                 READY   STATUS    RESTARTS   AGE   IP           NODE                                           NOMINATED NODE   READINESS GATES
learn-fast-with-ai   1/1     Running   0          31s   10.72.0.22   gk3-autopilot-cluster-1-pool-1-b3ba9f8f-nr9x   <none>           <none>
```

**Information Displayed:**
- `IP` - Pod's internal IP address
- `NODE` - Which node the pod is running on
- `READY` - Container readiness (1/1 = ready)

### 3. View Pod Events and Details

Get detailed information about pod creation and events:

```bash
kubectl describe pod learn-fast-with-ai | tail -20
```

### 4. Get Pod Logs

View container logs (useful for debugging):

```bash
kubectl logs learn-fast-with-ai
```

---

## 🌐 Exposing the Application Publicly

### 1. Create LoadBalancer Service

Expose your pod publicly with a LoadBalancer service:

```bash
kubectl expose pod learn-fast-with-ai --type=LoadBalancer --port=80 --target-port=3000 --name=learn-fast-with-ai-service
```

**Parameters:**
- `--type=LoadBalancer` - Creates a GCP Load Balancer with public IP
- `--port=80` - External port (HTTP)
- `--target-port=3000` - Container port (where your app listens)
- `--name` - Service name

**Expected Output:**
```
service/learn-fast-with-ai-service exposed
```

### 2. Check Service Status

Monitor service creation and get external IP:

```bash
kubectl get svc learn-fast-with-ai-service
```

**Initial Output (IP pending):**
```
NAME                         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
learn-fast-with-ai-service   LoadBalancer   34.118.234.64   <pending>     80:30207/TCP   5s
```

**Final Output (with IP):**
```
NAME                         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
learn-fast-with-ai-service   LoadBalancer   34.118.234.64   35.236.2.123   80:30207/TCP   3m15s
```

**Note:** External IP provisioning takes 2-5 minutes in GKE.

### 3. Get All Services

View all services in the cluster:

```bash
kubectl get svc
```

### 4. Get Service Details

View detailed service configuration:

```bash
kubectl get svc learn-fast-with-ai-service -o yaml
```

---

## 🧪 Testing the Application

### Test Application Accessibility

Check if your application is responding:

```bash
curl -s -o /dev/null -w "%{http_code}" http://35.236.2.123
```

**Expected Output:**
```
200
```

**Success Codes:**
- `200` - Application is healthy and responding
- `404` - Not found (might be application routing issue)
- `502` - Bad gateway (container not ready)
- `Connection refused` - Service not accessible yet

---

## 🗑️ Cleanup Commands

### ⚠️ Remove All Created Resources

Follow these steps in order to safely remove all resources:

#### Step 1: Delete the Service (Releases External IP)

```bash
kubectl delete svc learn-fast-with-ai-service
```

**Expected Output:**
```
service "learn-fast-with-ai-service" deleted
```

**Result:** LoadBalancer is deprovisioned, external IP is released (takes ~2-5 minutes).

#### Step 2: Delete the Pod

```bash
kubectl delete pod learn-fast-with-ai
```

**Expected Output:**
```
pod "learn-fast-with-ai" deleted
```

#### Step 3: Verify Cleanup

Verify all resources are removed:

```bash
kubectl get pods && kubectl get svc
```

**Expected Output:**
```
No resources found in default namespace.
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   34.118.224.1   <none>        443/TCP   Xm
```

**Note:** Only the default `kubernetes` service should remain.

---

## 🎯 Quick Reference

### Most Used Commands

| What | Command |
|------|---------|
| **List pods** | `kubectl get pods` |
| **List services** | `kubectl get svc` |
| **Pod details** | `kubectl get pods -o wide` |
| **Service details** | `kubectl get svc -o wide` |
| **Describe pod** | `kubectl describe pod <pod-name>` |
| **Describe service** | `kubectl describe svc <service-name>` |
| **Pod logs** | `kubectl logs <pod-name>` |
| **Delete pod** | `kubectl delete pod <pod-name>` |
| **Delete service** | `kubectl delete svc <service-name>` |

### Service Type Comparison

| Type | Pros | Cons | Use Case |
|------|------|------|----------|
| **LoadBalancer** | ✅ Simple, direct public IP, HTTP | ❌ No HTTPS by default, higher cost | Quick public access |
| **NodePort** | ✅ Works without LoadBalancer | ❌ Need to expose node ports, less secure | Development/testing |
| **Ingress** | ✅ HTTPS/SSL, advanced routing, cost-effective | ❌ More complex setup | Production with SSL |

---

## 🔍 Troubleshooting

### Pod in "ContainerCreating" State

```bash
# Check pod events
kubectl describe pod learn-fast-with-ai

# Wait for pull to complete (typically 30-60 seconds)
kubectl get pods -w
```

### Service External IP Pending

```bash
# Check service events
kubectl describe svc learn-fast-with-ai-service

# Wait for IP provisioning (typically 2-5 minutes)
watch kubectl get svc
```

### Application Not Responding

```bash
# Check pod status
kubectl get pods learn-fast-with-ai

# Check pod logs
kubectl logs learn-fast-with-ai

# Check if container is running
kubectl describe pod learn-fast-with-ai
```

---

## 💡 Best Practices

### ✅ Do's
- Always verify pod is running before exposing it
- Check logs if application isn't responding
- Use specific image tags (not `latest`)
- Clean up resources when done (to avoid costs)
- Monitor resource usage in GKE console

### ❌ Don'ts
- Don't expose without authentication (if sensitive)
- Don't forget to delete LoadBalancer services (costs money)
- Don't use NodePort in production (less secure)
- Don't expose development containers
- Don't ignore pod restart counts (check for errors)

---

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GKE LoadBalancer Services](https://cloud.google.com/kubernetes-engine/docs/how-to/exposing-apps)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [GCP Artifact Registry](https://cloud.google.com/artifact-registry/docs)

---

**Last Updated:** 2025-01-27

