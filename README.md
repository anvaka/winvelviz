# Wind Visualization Over Time

This repository describes a method to visualize winds over long periods of time.

![couple days demo](https://i.imgur.com/iiNR6le.gif)

The demo above shows 12 days of wind data. It has reduced quality. To see a high resolution video
for a longer period of time please go here: _TODO: Link_

## The method

In a single day we can "capture" wind by recording its velocity vector. If we record
these vectors in every point on the Earth, we'd get nothing else but a vector field.

One way to visualize a vector field is to use streamlines. We drop thousands particles onto the vector
field, and trace their movement. There are many ways to draw traces "nicely" and one of such ways was
implemented in [anvaka/streamlines](https://github.com/anvaka/streamlines) library.

Here is how a single snapshot of streamlines look like:

[![single streamlines](https://i.imgur.com/N8GB667l.jpg)](https://i.imgur.com/N8GB667.jpg)

_click on the image to see high resolution version - you will notice individual traces_

Now that we have a single snapshot we can collect multiple snapshots day by date, and concatenate
them into single video.

## The data

The data comes from https://nomads.ncdc.noaa.gov/data/gfsanl/ - I downloaded every grib file for
the year 2018, and extracted vector fields for winds at the height of 10 meters.

Along the way I [wrote a few tools](https://github.com/anvaka/winvelviz/blob/master/code/) to extract data
and turn it into images.

Unfortunately there are 10-20 days missing from this source. I couldn't find an alternative,r
but it was not critical for my exploration.

## Thanks!

Thank you for reading this! I hope you enjoyed it. Please let me know if you have any questions
[my twitter](https://twitter.com/anvaka) is always open, or send me an email.

Also if you like what I'm doing and want to support me: https://www.patreon.com/anvaka
