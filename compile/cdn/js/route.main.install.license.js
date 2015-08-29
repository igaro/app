//# sourceURL=route.main.install.license.js

module.requires = [
    { name:'route.main.install.license.css' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.stash.title=_tr("License");

domMgr.mk('p',wrapper, _tr("Igaro App"));
domMgr.mk('p',wrapper, _tr("Copyright (C) 2015 Andrew Charnley"));
domMgr.mk('strong',wrapper, _tr("Third party modules (3rdparty.*) may be licensed under alternative open-source licenses."));
domMgr.mk('p',wrapper, _tr("This program is free software: you can redistribute it and/or modify it under the terms of the Lesser GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version."));
domMgr.mk('p',wrapper, _tr("This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Lesser GNU Affero General Public License for more details."));
domMgr.mk('p',wrapper, _tr("You should have received a copy of the Lesser GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/."));

    };

};
