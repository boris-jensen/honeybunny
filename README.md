Contains some text adventures made in Twine, some monkey-themed games made in Makecode Arcade, and some hand-crafted javascript interactive visualizations.

Content is hosted on https://honeybunnygames.neocities.org/

Notes to self:

Github PAT renewal:

Once enough time passes, your github PAT will expire, and you will not be able to push to github from your local machine. To fix: Go to github -> click avatar top right -> settings -> developer settings -> personal access tokens -> fine grained tokens. Click on the token called "honeybunny push", and click regenerate token. Select an appropriate period before expiry, and click "Regenerate token". Copy the token, and add it to the URL for the origin remote, either by directly editing .git/config, or by running "git remote set-url origin https://<YOUR_PAT_HERE>@github.com/boris-jensen/honeybunny.git"