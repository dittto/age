# Aural Game Engine (AGE)

AGE is a "Choose your own adventure" game engine for the Amazon Echo.

You specify the **rooms** a player can move between, the items and objects they can interact with, and the valid commands per room. Then all you need to do is upload this to Amazon Lambda and setup an Alexa app.
 
AGE uses an **inventory** for managing what you're carrying so far, but also a **flag** system to allow you to give a single room multiple states. This means that you define a room with a closed door but allow multiple ways to flag it as open such as unlocking it, or convincing a guard to open it, or a hidden switch. The aim is to allow you to crete the experience you want with as few limits as possible.

It's likely there will always be some things about AGE that you want to alter. To assist with that, AGE supports **plugins** to allow you to add or alter functionality as you see fit. The base engine is made up from a set of generic plugins already, which we'll cover later on. 

## How to set AGE up

When working with Serverless, I tend to create a simple Docker container so I can keep my languages and their additional requirements separate from each other.

Before we focus on that though, we need to get some login details for AWS. Go to the AWS console and get an access key and secret. Then, create the following files and add it to there. All of these instructions assume you're in the AGE root directory:

```bash
# etc/aws.config
[default]
region = eu-west-1

# etc/aws.credentials
[default]
aws_access_key_id = *********
aws_secret_access_key = *****************
```

Now we have our security sorted out, run the Docker container and log into it:

```bash
docker-compose up -d
docker exec -it age bash
```

This will give us an environment with Node, AWS CLI, and Serverless already set up. To check it works, just type:

```bash
serverless help
```


### Serverless settings

### AGE configs
  
config files

    config
    
    items
    
    rooms
    
    start_menu
    
plugins

    start menu
    
    rooms
    
    inspector
    
    flags
    
    inventory

how to test

config generator


how to create your own game

    rooms
    
    items
    
    start_menu
    
    audio instead of Alexa