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
package org.onosproject.faultmanagement.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

import org.junit.Test;
import org.onosproject.codec.JsonCodec;
import static org.onosproject.faultmanagement.web.AlarmJsonMatcher.matchesAlarm;
import org.onosproject.net.DeviceId;
import org.onosproject.incubator.net.faultmanagement.alarm.Alarm;
import org.onosproject.incubator.net.faultmanagement.alarm.AlarmEntityId;
import org.onosproject.incubator.net.faultmanagement.alarm.AlarmId;
import org.onosproject.incubator.net.faultmanagement.alarm.DefaultAlarm;

public class AlarmCodecTest {

    private final AlarmCodecContext context = new AlarmCodecContext();

    // Use this to check handling for miminal Alarm
    private final Alarm alarmMinimumFields = new DefaultAlarm.Builder(
            new AlarmId(44),
            DeviceId.deviceId("of:2222000000000000"),
            "NE unreachable",
            Alarm.SeverityLevel.CLEARED,
            1).
            build();

    // Use this to check handling for fully populated Alarm
    private final Alarm alarmWithSource = new DefaultAlarm.Builder(
            new AlarmId(44),
            DeviceId.deviceId("of:2222000000000000"),
            "NE unreachable",
            Alarm.SeverityLevel.CLEARED, 1).
            forSource(AlarmEntityId.alarmEntityId("port:1/2/3/4")).
            withTimeUpdated(2).
            withTimeCleared(3L).
            withServiceAffecting(true).
            withAcknowledged(true).
            withManuallyClearable(true).
            withAssignedUser("the assigned user").build();

    @Test
    public void alarmCodecTestWithOptionalFieldMissing() {
        //context.registerService(AlarmService.class, new AlarmServiceAdapter());
        final JsonCodec<Alarm> codec = context.codec(Alarm.class);
        assertThat(codec, is(notNullValue()));

        final ObjectNode alarmJson = codec.encode(alarmMinimumFields, context);
        assertThat(alarmJson, notNullValue());
        assertThat(alarmJson, matchesAlarm(alarmMinimumFields));

    }

    @Test
    public void alarmCodecTestWithOptionalField() {
        final JsonCodec<Alarm> codec = context.codec(Alarm.class);
        assertThat(codec, is(notNullValue()));

        final ObjectNode alarmJson = codec.encode(alarmWithSource, context);
        assertThat(alarmJson, notNullValue());
        assertThat(alarmJson, matchesAlarm(alarmWithSource));

    }

    @Test
    public void verifyMinimalAlarmIsEncoded() throws Exception {
        final JsonCodec<Alarm> alarmCodec = context.codec(Alarm.class);

        final Alarm alarm = getDecodedAlarm(alarmCodec, "alarm-minimal.json");
        assertCommon(alarm);

        assertThat(alarm.timeCleared(), nullValue());
        assertThat(alarm.assignedUser(), nullValue());

    }

    @Test
    public void verifyFullyLoadedAlarmIsEncoded() throws Exception {
        final JsonCodec<Alarm> alarmCodec = context.codec(Alarm.class);

        final Alarm alarm = getDecodedAlarm(alarmCodec, "alarm-full.json");
        assertCommon(alarm);

        assertThat(alarm.timeCleared(), is(2222L));
        assertThat(alarm.assignedUser(), is("foo"));

    }

    private void assertCommon(final Alarm alarm) {
        assertThat(alarm.id(), is(new AlarmId(10L)));
        assertThat(alarm.description(), is("NE is not reachable"));
        assertThat(alarm.source(), is(AlarmEntityId.NONE));
        assertThat(alarm.timeRaised(), is(999L));
        assertThat(alarm.timeUpdated(), is(1111L));
        assertThat(alarm.severity(), is(Alarm.SeverityLevel.MAJOR));
        assertThat(alarm.serviceAffecting(), is(true));
        assertThat(alarm.acknowledged(), is(false));
        assertThat(alarm.manuallyClearable(), is(true));
    }

    /**
     * Reads in a rule from the given resource and decodes it.
     *
     * @param resourceName resource to use to read the JSON for the rule
     * @return decoded flow rule
     * @throws IOException if processing the resource failsdecode
     */
    private Alarm getDecodedAlarm(final JsonCodec<Alarm> codec, final String resourceName) throws IOException {
        final InputStream jsonStream = AlarmCodecTest.class
                .getResourceAsStream(resourceName);
        final JsonNode json = context.mapper().readTree(jsonStream);
        assertThat(json, notNullValue());
        final Alarm result = codec.decode((ObjectNode) json, context);
        assertThat(result, notNullValue());
        return result;
    }


}
