## 概览
> `setting`阶段数据,可以在`data`和`control`阶段使用

## Location

> `settings.lua`
> `settings-updates.lua`
> `settings-final-fixes.lua`

## Creation
```
data:extend({
    {
        type = "bool-setting",
        name = "my-mod-test-setting",
        setting_type = "runtime-global",
        default_value = true
    }
})
```

> `name` 变量名称
> `type` 主要包含`bool-setting`,`int-setting`,`double-setting`,`string-setting`
> `order` 加载顺序
> `setting-type` 主要包含`statup`,`runtime-global`,`runtime-per-user`

## Local

## Usage
### Reading Settings
```lua
--in settings.lua:
data:extend({
    {
        type = "int-setting",
        name = "my-mod-stone-wall-stack-size",
        setting_type = "startup",
        minimum_value = 1,
        default_value = 100
    }
})

--in data.lua:
data.raw.item["stone-wall"].stack_size = settings.startup["my-mod-stone-wall-stack-size"].value
```

### Writing Setings
```lua
--in settings.lua:
data:extend({
    {
        type = "bool-setting",
        name = "my-mod-ever-crafted-item",
        setting_type = "runtime-per-user",
        default_value = false
    },
    {
        type = "string-setting",
        name = "my-mod-always-difficult",
        setting_type = "runtime-global",
        default_value = "yes",
        allowed_values = {"yes", "no"}
    }
})

--in control.lua:
script.on_event(defines.events.on_player_crafted_item, function(event)
    settings.get_player_settings(game.get_player(event.player_index))["my-mod-ever-crafted-item"] = {value = true}
    -- We just allowed ourselves to check whether the player ever crafted an item in other game saves.
    -- Note that this only works if the player does not mess with the setting, and if their "keep mod settings per save" setting is off.
end)

script.on_event(on_rocket_launched, function()
    settings.global["my-mod-always-difficult"] = {value = "yes"}
end)
```