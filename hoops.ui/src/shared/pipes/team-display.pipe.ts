import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a team for display as "{name|color} ({number})"
 *
 * Rules:
 *   - Use teamName when present (custom name), otherwise fall back to teamColor.
 *   - Append the season number in parens, stripping any leading zeros.
 *   - Omit the parens entirely when the season number is 0 or absent.
 *
 * Usage:
 *   {{ game.homeTeamName | teamDisplay : game.homeTeamColor : game.homeTeamSeasonNumber }}
 *   → "Warriors (3)"  (custom name)
 *   → "Red (3)"       (color fallback, no custom name)
 */
@Pipe({ name: 'teamDisplay', standalone: true, pure: true })
export class TeamDisplayPipe implements PipeTransform {
  transform(
    teamName: string | null | undefined,
    teamColor: string | null | undefined,
    seasonNumber: number | null | undefined,
  ): string {
    const label = teamName?.trim() || teamColor?.trim() || '';
    const num =
      seasonNumber && seasonNumber > 0
        ? String(seasonNumber).replace(/^0+/, '')
        : '';
    return num ? `${label} (${num})` : label;
  }
}
