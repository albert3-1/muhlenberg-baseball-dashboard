import urllib.request
import re
import json

# All Centennial Conference baseball teams with their stats URLs
TEAMS = {
    'muh': 'https://muhlenbergsports.com/sports/baseball/stats/2025',
    'jhu': 'https://hopkinssports.com/sports/baseball/stats/2025',
    'get': 'https://gettysburgsports.com/sports/baseball/stats/2025',
    'hav': 'https://haverfordathletics.com/sports/baseball/stats/2025',
    'mcd': 'https://mcdanielathletics.com/sports/baseball/stats/2025',
    'wac': 'https://washingtoncollegesports.com/sports/baseball/stats/2025',
    'fandm': 'https://godiplomats.com/sports/baseball/stats/2025',
    'swa': 'https://swarthmoreathletics.com/sports/baseball/stats/2025',
    'urs': 'https://ursinusathletics.com/sports/baseball/stats/2025',
    'dick': 'https://dickinsonathletics.com/sports/baseball/stats/2025'
}

def fetch_page(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f'Error fetching {url}: {e}')
        return None

MIN_AB = 30  # Minimum at-bats for batters to qualify
MIN_IP = 10  # Minimum innings pitched for pitchers to qualify

def parse_batting_table(html):
    """Parse the cumulative batting stats table - Sidearm Sports format"""
    batters = []

    # Find sortable tables - the first one is typically batting
    sortable_tables = re.findall(r'<table[^>]*sortable-table[^>]*>(.*?)</table>', html, re.DOTALL)

    if not sortable_tables:
        print('  No sortable tables found')
        return batters

    # First sortable table should be batting (check for AVG header)
    batting_table = None
    for table in sortable_tables:
        if 'data-label="AVG"' in table or '>AVG<' in table:
            batting_table = table
            break

    if not batting_table:
        print('  Could not find batting table')
        return batters

    # Parse body rows
    body_match = re.search(r'<tbody[^>]*>(.*?)</tbody>', batting_table, re.DOTALL)
    if not body_match:
        print('  No tbody found')
        return batters

    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', body_match.group(1), re.DOTALL)

    for row in rows[:30]:  # Check more players to get all qualified
        # Player name is in a <th> tag with scope="row"
        name_match = re.search(r'<th[^>]*scope="row"[^>]*>.*?<a[^>]*>([^<]+)</a>', row, re.DOTALL)
        if not name_match:
            # Try alternate pattern
            name_match = re.search(r'<th[^>]*>.*?<a[^>]*>([^<]+)</a>', row, re.DOTALL)
        if not name_match:
            continue

        name = name_match.group(1).strip()
        if not name or 'total' in name.lower() or 'opponent' in name.lower():
            continue

        # Extract stats using data-label attributes
        def get_stat(label, default='0'):
            match = re.search(rf'data-label="{label}"[^>]*>([^<]+)<', row)
            if match:
                return match.group(1).strip()
            return default

        try:
            # Parse GP-GS (games played - games started)
            gp_gs = get_stat('GP-GS', '0-0')
            if '-' in gp_gs:
                parts = gp_gs.split('-')
                gp = int(parts[0]) if parts[0].isdigit() else 0
            else:
                gp = int(gp_gs) if gp_gs.isdigit() else 0

            # At-bats - critical for threshold
            ab = int(get_stat('AB', '0')) if get_stat('AB', '0').isdigit() else 0

            avg_str = get_stat('AVG', '.000')
            avg = float(avg_str) if avg_str.replace('.','').replace('-','').isdigit() else 0

            # Hits
            h = int(get_stat('H', '0')) if get_stat('H', '0').isdigit() else 0

            # Doubles (2B)
            doubles = int(get_stat('2B', '0')) if get_stat('2B', '0').isdigit() else 0

            # Triples (3B)
            triples = int(get_stat('3B', '0')) if get_stat('3B', '0').isdigit() else 0

            # Home runs
            hr = int(get_stat('HR', '0')) if get_stat('HR', '0').isdigit() else 0

            # RBI
            rbi = int(get_stat('RBI', '0')) if get_stat('RBI', '0').isdigit() else 0

            # Runs
            r = int(get_stat('R', '0')) if get_stat('R', '0').isdigit() else 0

            # Walks (BB)
            bb = int(get_stat('BB', '0')) if get_stat('BB', '0').isdigit() else 0

            # Strikeouts (SO or K)
            so_str = get_stat('SO', get_stat('K', '0'))
            so = int(so_str) if so_str.isdigit() else 0

            # SB is in format "17-20" (stolen-caught), we want both
            sb_str = get_stat('SB', '0-0')
            if '-' in sb_str:
                parts = sb_str.split('-')
                sb = int(parts[0]) if parts[0].isdigit() else 0
            else:
                sb = int(sb_str) if sb_str.isdigit() else 0

            # OPS (on-base plus slugging)
            ops_str = get_stat('OPS', '0')
            ops = float(ops_str) if ops_str.replace('.','').replace('-','').isdigit() else 0

            # OBP (on-base percentage)
            obp_str = get_stat('OBP', '0')
            obp = float(obp_str) if obp_str.replace('.','').replace('-','').isdigit() else 0

            # SLG (slugging percentage)
            slg_str = get_stat('SLG', '0')
            slg = float(slg_str) if slg_str.replace('.','').replace('-','').isdigit() else 0

            # Only include players who meet minimum AB threshold
            if ab >= MIN_AB:
                batters.append({
                    'name': name,
                    'gp': gp,
                    'ab': ab,
                    'avg': round(avg, 3),
                    'h': h,
                    'doubles': doubles,
                    'triples': triples,
                    'hr': hr,
                    'rbi': rbi,
                    'r': r,
                    'bb': bb,
                    'so': so,
                    'sb': sb,
                    'obp': round(obp, 3),
                    'slg': round(slg, 3),
                    'ops': round(ops, 3)
                })
        except (ValueError, IndexError) as e:
            print(f'  Error parsing {name}: {e}')
            continue

    # Sort by average but return ALL qualified players
    batters.sort(key=lambda x: x['avg'], reverse=True)
    return batters

def parse_pitching_table(html):
    """Parse the cumulative pitching stats table - Sidearm Sports format"""
    pitchers = []

    # Find sortable tables
    sortable_tables = re.findall(r'<table[^>]*sortable-table[^>]*>(.*?)</table>', html, re.DOTALL)

    if not sortable_tables:
        return pitchers

    # Find the pitching table (has ERA header)
    pitching_table = None
    for table in sortable_tables:
        if 'data-label="ERA"' in table or '>ERA<' in table:
            pitching_table = table
            break

    if not pitching_table:
        print('  Could not find pitching table')
        return pitchers

    # Parse body rows
    body_match = re.search(r'<tbody[^>]*>(.*?)</tbody>', pitching_table, re.DOTALL)
    if not body_match:
        return pitchers

    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', body_match.group(1), re.DOTALL)

    for row in rows[:25]:  # Check more players to get all qualified
        # Player name is in a <th> tag
        name_match = re.search(r'<th[^>]*scope="row"[^>]*>.*?<a[^>]*>([^<]+)</a>', row, re.DOTALL)
        if not name_match:
            name_match = re.search(r'<th[^>]*>.*?<a[^>]*>([^<]+)</a>', row, re.DOTALL)
        if not name_match:
            continue

        name = name_match.group(1).strip()
        if not name or 'total' in name.lower() or 'opponent' in name.lower():
            continue

        def get_stat(label, default='0'):
            match = re.search(rf'data-label="{label}"[^>]*>([^<]+)<', row)
            if match:
                return match.group(1).strip()
            return default

        try:
            # APP-GS (appearances - games started)
            app_gs = get_stat('APP-GS', get_stat('APP', '0-0'))
            if '-' in str(app_gs):
                parts = str(app_gs).split('-')
                app = int(parts[0]) if parts[0].isdigit() else 0
                gs = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 0
            else:
                app = int(app_gs) if str(app_gs).isdigit() else 0
                gs = 0

            era_str = get_stat('ERA', '99.99')
            era = float(era_str) if era_str.replace('.','').replace('-','').isdigit() else 99.99

            # W-L is often in one column
            wl = get_stat('W-L', '0-0')
            if '-' in wl:
                parts = wl.split('-')
                w = int(parts[0]) if parts[0].isdigit() else 0
                l = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 0
            else:
                w = 0
                l = 0

            # Saves
            sv = int(get_stat('SV', '0')) if get_stat('SV', '0').isdigit() else 0

            # Innings pitched
            ip_str = get_stat('IP', '0')
            ip = float(ip_str) if ip_str.replace('.','').isdigit() else 0

            # Hits allowed
            h = int(get_stat('H', '0')) if get_stat('H', '0').isdigit() else 0

            # Runs allowed
            r = int(get_stat('R', '0')) if get_stat('R', '0').isdigit() else 0

            # Earned runs
            er = int(get_stat('ER', '0')) if get_stat('ER', '0').isdigit() else 0

            # Walks (BB)
            bb = int(get_stat('BB', '0')) if get_stat('BB', '0').isdigit() else 0

            # Strikeouts (SO or K)
            so_str = get_stat('SO', get_stat('K', '0'))
            so = int(so_str) if so_str.isdigit() else 0

            # WHIP
            whip_str = get_stat('WHIP', '0')
            whip = float(whip_str) if whip_str.replace('.','').replace('-','').isdigit() else 0

            # Hit by pitch
            hbp = int(get_stat('HB', get_stat('HBP', '0'))) if get_stat('HB', get_stat('HBP', '0')).isdigit() else 0

            # Only include pitchers who meet minimum IP threshold
            if ip >= MIN_IP:
                pitchers.append({
                    'name': name,
                    'app': app,
                    'gs': gs,
                    'era': round(era, 2),
                    'w': w,
                    'l': l,
                    'sv': sv,
                    'ip': ip,
                    'h': h,
                    'r': r,
                    'er': er,
                    'bb': bb,
                    'so': so,
                    'whip': round(whip, 2),
                    'hbp': hbp
                })
        except (ValueError, IndexError):
            continue

    # Sort by ERA (lower is better) but return ALL qualified pitchers
    pitchers.sort(key=lambda x: x['era'])
    return pitchers

# Scrape all teams
all_players = {}

for team_id, url in TEAMS.items():
    print(f'\nFetching {team_id.upper()}: {url}')
    html = fetch_page(url)
    if not html:
        print(f'  FAILED to fetch')
        all_players[team_id] = {'batters': [], 'pitchers': []}
        continue

    batters = parse_batting_table(html)
    pitchers = parse_pitching_table(html)

    print(f'  Found {len(batters)} qualified batters (min {MIN_AB} AB), {len(pitchers)} qualified pitchers (min {MIN_IP} IP)')
    for b in batters[:5]:  # Just show top 5 for console output
        print(f'    {b["name"]}: AB={b["ab"]}, AVG={b["avg"]}, H={b["h"]}, HR={b["hr"]}, RBI={b["rbi"]}, SB={b["sb"]}, OPS={b["ops"]}')

    all_players[team_id] = {
        'batters': batters,
        'pitchers': pitchers
    }

print('\n\n=== JSON OUTPUT ===')
print(json.dumps(all_players, indent=2))
