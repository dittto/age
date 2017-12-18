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

For this first attempt, we'll start with testing the basic game AGE comes with. There are a series of tests related to this basic game. Let's run one now: 

```bash
serverless invoke local --function age --path test/state/StartMenu/01.json
```

This should result in:

```bash
{
    "version": "1.0",
    "response": {
        "shouldEndSession": false,
        "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak> Welcome to AGE test. \"Start a new game\" or listen to the \"credits\"  </speak>"
        },
        "reprompt": {
            "outputSpeech": {
                "type": "SSML",
                "ssml": "<speak> You need to respond or this will end </speak>"
            }
        }
    },
    "sessionAttributes": {
        "STATE": "MainMenu"
    },
    "userAgent": "ask-nodejs/1.0.23 Node/v6.11.4"
}
```

The result shows a JSON response that Alexa can understand. The important parts of this are the `outputSpeech` sections, so we can see what Alexa will do, and the `sessionAttributes` as this will tell us what **State** we're in and what variables we've stored for later.

If it doesn't result in the above, check the errors response to see what's wrong. Serverless debugging is enabled by default in the `docker-compose.yaml` file by adding `SLS_DEBUG: "*"` to the environment variables.

AGE automatically stores your session in a DynamoDB table is creates. If you don't have internet access, or you have the wrong AWS credentials, then this will either error or hang.

When we're happy the tests are working (and there are another 30-odd that check various things regarding normal AGE usage), we can deploy our codebase to Lambda, ready for Alexa to use it.

```bash
serverless deploy
```

Assuming your AWS credentials have the correct permissions, this should take about 30 seconds and then be done.

You can now plug your Lambda command into Alexa and test it. We'll cover that later, although it's worth mentioning here that any `console.log()` commands or errors in your code will get logged to **CloudWatch logs**. 

This makes it easy to debug as everything you want to track can easily be outputted automatically to there, whether you're calling your Lambda code through the Alexa test app during setup, or from an Amazon Echo.

## Configuration

One of the main aims of AGE is to allow a lot of functionality via simple YAML files. The ultimate aim is to have a simple GUI frontend that generates those YAML files for you, making it really simple to set up a new game.

### Serverless config

This config is one you'll likely only need to setup once and then you can leave it. The following shows the default config from `src/serverless.yml`:

```yaml
service: aural-game-engine

custom:
  shared:
    region: eu-west-1
    dynamodb_table: show_space_monsters
    dynamodb_read_capacity: 1
    dynamodb_write_capacity: 1
```

The `service` is the name of your game, although i'd stick to alphanumeric characters and the odd hyphen.

The next four options are all related to AWS. The `region` is where you want to host your Lambda application, and your DynamoDB. `dynamodb_table` is the name of your DynamoDB table.

`dynamodb_read_capacity` and `dynamodb_write_capacity` are basically a gauge of how many concurrent users you expect to get. For testing, 1 and 1 are ok, but when you release you'll probably want to massively increase these.

There are some other options in `src/serverless.yml` but these are very much for the advanced user.
 
### The src/config/* files

These config files are what you'll use to create your game. Because some are quite complex, they've got their own documentation section:

- [config.yaml](documentation/config/config.yaml.md)
- [items.yaml](documentation/config/items.yaml.md)
- [rooms.yaml](documentation/config/rooms.yaml.md)
- [start_menu.yaml](documentation/config/start_menu.yaml.md)

With most plugins created, and in the main config directory, there is an additional `_helper.yaml` file. These are covered below in the config generator section. 

## Plugins

AGE is made up of a set of plugins. Some do a lot of work, like `rooms`, and others just provide useful extra functionality, such as `inventory`. The default ones are:

- [flags](documentation/plugins/flags.yaml.md)
- [inspector](documentation/plugins/inspector.yaml.md)
- [inventory](documentation/plugins/inventory.yaml.md)
- [rooms](documentation/plugins/rooms.yaml.md)
- [start_menu](documentation/plugins/start_menu.yaml.md)

To add a custom plugin to AGE, follow the instructions in [adding a custom plugin](documentation/plugins/_custom.yaml).

## Testing

As briefly touched on before, there is some very simple method of testing built into AGE. These are sample request JSON files stored in `src/test`. These can be used by running:

```bash
serverless invoke local --function age --path test/state/StartMenu/01.json
```

You do currently need internet access to run these or AWS will complain about a lack of access to DynamoDB (or just freeze).

## The config generator

We've covered how to set up the Lambda and build that, but when it comes time to create your Alexa application you'll be asked for three bits of information - the `intents.json`, some `Sample Utterances`, and the `slot values`.

Slot values are the variables a user will say to trigger an action, such `north` in `move north`, or `lamp` in `pickup lamp`.

There is a file in `src/config` called `_helper.json`. This defines the slot values for your various slots. If you run the following command, you'll get three files added to the `./data` folder.

```bash
serverless age-config
``` 

Of these three files, `intents.json` and `SampleUtterances.txt` can be simply copied direct into your Alexa setup. `SlotValues.txt`, on the other hand requires a bit more manual work. The text in square brackets is your slot name, and the values are listed below it. Each of these needs to be created during your Alexa application setup.

For references, the rest of this data comes from the plugins, which (if required) each contain a `_helper.json` that defines a list of utterances, intents, and slot values.
