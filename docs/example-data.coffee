# notes explaining vocab, limitations, etc at the end!

# 'tables' are split into three groups -- summary data from reviews, individual reviews, and basic objects



window.EXAMPLE_DATA =

  # summary data, (generated by the server from individual reviews)



  # individual reviews




  # detail info about objects

  outcome_aliases:
    'state: feeling relaxed': [
      'getting relaxed'
      'being relaxed'
      'being chill'
      'feeling chill'
    ]
    'activity: distance biking': [
      'touring (bicycle)',
      'bike trips',
    ]


  # for more active users, profile information
  # FIXME: some of this data is redundant with review data



  # indexes

  profile_public_resources:
    'facebook:514190':
      'facebook.com': true

  profile_public_desires:
    'facebook:514190':
      'activity: mindless reading': true
      'virtue: being bold': true
      'state: feeling relaxed': true




##### NOTES

# re the server-generated summary data:
#   these are naive aggregations!
#   to take demographics, locations, etc into
#   account, do your own analysis starting with the
#   'reviews' and 'people' tables


#### NOT DONE YET

# 'reviews' will have a way of encoding the engagement pattern (i.e., used an app for an hour a week, bought and then used a bicycle daily, etc) but we haven't designed it yet

# 'people' will have information about number of facebook friends in their current city, better info on location, and whatever raw info might help us nail their psychographic (fb likes?)

# we need some measures of variance / distributional irregularity in the 'common desires' and 'best options' tables, but I'm not sure what to use yet


##### TERMS USED

# upfront_time = time invested before you could see an outcome is 'going well'
# winner = someone for whom a (resource, outcome) pair is "going well"