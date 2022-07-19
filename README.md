# Dottore (Genshin Artifact Enhance Helper)

The project is still in its early stages.
So it does not have a friendly user interface yet.

## Features

### Sub-stat rarity in terms of obtaining

The function `src.gsop.artifact.rarity.p_y_useful_given_x()` calculates the probability of obtaining
an artifact with `y` or more useful attributes given there are `x` initial attributes.

### Sub-stat rating based on its potential

The function `src.gsop.artifact.rating.artifact_rating_expectation()` calculates the average score
the given artifact will get when it is level up to 20. Caller can custom weights for the attributes.

### Sub-stat rating based on its potential and rarity

The function `src.gsop.artifact.rating.relative_rating_compare_subattrs()` calculates the
possibility of getting an artifact which has its current potential score.

### More

Developing...

## Current Plan

- Develop a user-friendly interface (mobile app / web).
- Improve the algorithm which do the math.
- More functions added to evaluate a standalone artifact. (potential, and fair score based on rarity)

## Interested in Joining or Have a Question

Please contact me for more information.

- Email: JarvisYu_Pro@outlook.com
