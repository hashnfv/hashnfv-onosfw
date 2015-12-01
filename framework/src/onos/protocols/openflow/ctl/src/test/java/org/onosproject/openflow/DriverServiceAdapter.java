/*
 * Copyright 2015 Open Networking Laboratory
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.onosproject.openflow;

import java.util.Set;

import org.onosproject.net.DeviceId;
import org.onosproject.net.driver.Behaviour;
import org.onosproject.net.driver.Driver;
import org.onosproject.net.driver.DriverHandler;
import org.onosproject.net.driver.DriverService;

/**
 * Created by ray on 11/4/15.
 */
public class DriverServiceAdapter implements DriverService {
    @Override
    public Set<Driver> getDrivers() {
        return null;
    }

    @Override
    public Set<Driver> getDrivers(Class<? extends Behaviour> withBehaviour) {
        return null;
    }

    @Override
    public Driver getDriver(String mfr, String hw, String sw) {
        return null;
    }

    @Override
    public Driver getDriver(DeviceId deviceId) {
        return null;
    }

    @Override
    public DriverHandler createHandler(DeviceId deviceId, String... credentials) {
        return null;
    }

    @Override
    public Driver getDriver(String driverName) {
        return null;
    }
}