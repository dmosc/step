// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

/**
* The FindMeetingQuery receives a new Meeting request to fit inside a
* calendar day with existing meetings. It provides an interface to
* handle incoming meetings that must be scheduled for users without
* generating interference/overlapping with their existing meetings.
* 
* Algorithmic analysis
* N = Scheduled events
* M = The pool of people that can attend events
*
* Time complexity: O(N*M)
* Space complexity: O(N) being the availableTimeRanges ArrayList since it is technically possible to have N available time ranges.
*   The arrays minutesNoOptAttendees and minutesOptAttendees can be considered constant since
*   they represent an abstraction of a whole day divided in minutes.
*
* @param Collection<Event> List of scheduled events.
* @param MeetingRequest Event to fit in the available time windows.
* @return Collection<TimeRange>
*/

public final class FindMeetingQuery {
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        int TIME_WINDOW_IN_MINUTES = 60 * 24;
        Integer[] minutesNoOptAttendees = new Integer[TIME_WINDOW_IN_MINUTES];
        Integer[] minutesOptAttendees = new Integer[TIME_WINDOW_IN_MINUTES];

        Arrays.fill(minutesNoOptAttendees, 1);
        Arrays.fill(minutesOptAttendees, 1);

        ArrayList<TimeRange> availableTimeRanges = new ArrayList<>();
        ArrayList<Event> eventsToSet = new ArrayList<>(events);

        Collection<String> attendees = Collections.unmodifiableCollection(request.getAttendees());
        Collection<String> optionalAttendees = Collections.unmodifiableCollection(request.getOptionalAttendees());

        for (Event event : eventsToSet) { // N
            /* Verify that at least one of the request attendees
            is scheduled for the current event. */
            Set<String> eventAttendees = event.getAttendees();
            Boolean isAnyMandatoryBusy = !Collections.disjoint(eventAttendees, attendees); // M + P
            Boolean isAnyOptionalBusy = !Collections.disjoint(eventAttendees, optionalAttendees); // M + Q

            TimeRange when = event.getWhen();
            int start = when.start();
            int end = when.start() + when.duration();

            /* Mark available spaces as busy since there's at
                least one person from the request that isn't available */
            if (isAnyMandatoryBusy) {
                Arrays.fill(minutesNoOptAttendees, start, end, 0); // end - start ops.
                Arrays.fill(minutesOptAttendees, start, end, 0); // end - start ops.
            } else if (isAnyOptionalBusy) {
                Arrays.fill(minutesOptAttendees, start, end, 0); // end - start ops.
            }
        }

        long duration = request.getDuration();
        availableTimeRanges = getAvailableTimeRanges(minutesOptAttendees, duration);

        // If no time range works with optional attendees return the options without them.
        return availableTimeRanges.size() != 0 ? 
            availableTimeRanges : 
            getAvailableTimeRanges(minutesNoOptAttendees, duration);
    }

    /**
    * The getAvailableTimeRanges iterates over the already filled minutes array that represents an abstraction
    * of a day divided in minutes. This array is already "marked" with 0's on the indexes where there's a meeting
    * already scheduled. The method measures the length of each available section and compares it against the
    * requested event length to verify if is a possible solution.
    *
    * @param Integer[] Array abstraction of a whole day represented in minutes (1 available, 0 unavailable)
    * @param long Total duration in minutes of the requested event to schedule.
    * @return ArrayList<TimeRange>
    */
    private ArrayList<TimeRange> getAvailableTimeRanges(Integer[] minutes, long duration) {
        int windowSize = 0;
        ArrayList<TimeRange> timeRanges = new ArrayList<>();
        for (int i = 0; i < minutes.length; i++) {
            if (minutes[i] == 1) {
                ++windowSize;
            } else if (windowSize != 0) {
                TimeRange timeRange = TimeRange.fromStartDuration(i - windowSize, windowSize);

                /* If time window is large enough to contain the new meeting,
                    we have found a solution. */
                if (timeRange.duration() >= duration)
                    timeRanges.add(timeRange);

                windowSize = 0;
            }
        }

        TimeRange timeRange = TimeRange.fromStartDuration(minutes.length - windowSize, windowSize);

        /* Same evaluation but with the remaining time window */
        if (timeRange.duration() >= duration)
            timeRanges.add(timeRange);

        return timeRanges;
    }
}