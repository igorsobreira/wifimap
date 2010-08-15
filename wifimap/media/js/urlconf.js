
Page.registerLoadUrl("^/$", SpotListPage.load);
Page.registerUnloadUrl("^/$", SpotListPage.unload);

Page.registerLoadUrl("^/spots/add$", AddSpotPage.load);
Page.registerUnloadUrl("^/spots/add$", AddSpotPage.unload);

Page.registerLoadUrl("^/spots/[0-9]+/?$", SpotDetailPage.load);
