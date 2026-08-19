# js/cities

这里放城市数据。架构原则：**没有普通城市模板，每个城市都是特殊地图**。

## 文件分工

- `index.js`：轻量索引，只放 id/name/style/script/wasm 路径
- `city-*.js`：每个城市自己的完整地图数据
- `common-layout.js`：只放全局非地图默认，例如传送管；不要放普通地图模板
- `wasm-city-loader.js`：开发版按需加载 `city-*.js`，发布版按需加载 `wasm/cities/city-*.wasm`

## 城市分层

- `layout.paths`：道路
- `layout.buildings`：建筑
- `layout.flora`：花草树木，属于地图
- `npc`：城市 NPC，独立实体层
- `wildlife`：小动物/鱼/鸟，跟地图绑定，但不是 NPC
- `collectibles`：金币/宝箱

完整说明见根目录：`CITY_DATA_GUIDE.md`。

## 编辑方式

不要直接手改本目录的 `city-*.js`。现在它们由本地地图编辑器生成：

```bash
go run ./mapeditor
```

源数据在：

```text
mapdata/cities/*.json
```

手动改 JSON 后运行：

```bash
go run ./mapeditor -generate
```
