# Configs: config.yaml

This config file is the one that ties the game together. It provides default responses to save you having to add them to each room, and lists the plugins that your game will use.

## Invocation name

The simplest setting in this config is the invocation name. This is the name you'll say to Alexa to start your application. For instance, if your config is setup like:

```yaml
config:
    invocation_name: age test
```

Then you'll be able to say to Alexa (once you've setup your app) **Alexa, start age test**.

Because this field is used by Alexa, keep it lowercase and without punctuation.

## Plugins

The plugins section tells AGE what plugins we're going to use in our game. 

It uses `require()` to load the plugins, so will check any of the default paths, such as `node_modules`. It also, by default, checks for plugins in `src/Age/Plugin/` although we'd expect only the main AGE plugins will live here as we may use other paths in future and wouldn't want to clash with your code.

An example of plugins containing both default and `node-modules` paths is shown below. The last 2 are examples of plugins loaded via `node-modules`.

```yaml
config:
    plugins:
        - Default/Rooms
        - Default/Flags
        - Default/Inspector
        - Default/Inventory
        - Default/StartMenu
        - age-insult-fighting
        - custom-age-plugins/Plugins/BalletDancing
```

If you're using custom modules, you also need to make sure you include them in `src/serverless.yml`. To add the above example modules to it, do the following:

```yaml
plugins:
  - age-insult-fighting
  - custom-age-plugins
```

Take care not to remove any existing options set in `plugins` as they're used by AGE.

## Default responses

The default responses section contains all of the default responses that may be called by various plugins. If any of these are missing, then AGE should respond with a verbal error code so it can be added in future.

An example of these are:

```yaml
config:
    default_responses:
        repeat: If you want to hear that again, say "repeat".

        load_game:
            description: Welcome to back to AGE test. Would you like to continue where you left off? "yes" or "no".
            repeat: You have 8 seconds to comply. "yes" or "no".
```

As shown above, the `default_responses` is a free-form section, which makes it easy to define responses for custom plugins.