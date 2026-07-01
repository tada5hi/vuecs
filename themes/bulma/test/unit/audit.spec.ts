import { describe, expect, it } from 'vitest';
import {
    auditTheme,
    formatAuditResult,
    isAuditClean,
} from '@vuecs/core';
import { buttonThemeDefaults } from '@vuecs/button';
import { countdownThemeDefaults } from '@vuecs/countdown';
import {
    alertDescriptionThemeDefaults,
    alertThemeDefaults,
    alertTitleThemeDefaults,
    aspectRatioThemeDefaults,
    avatarThemeDefaults,
    badgeThemeDefaults,
    cardBodyThemeDefaults,
    cardDescriptionThemeDefaults,
    cardFooterThemeDefaults,
    cardHeaderThemeDefaults,
    cardPlaceholderThemeDefaults,
    cardThemeDefaults,
    cardTitleThemeDefaults,
    collapseContentThemeDefaults,
    collapseThemeDefaults,
    collapseTriggerThemeDefaults,
    separatorThemeDefaults,
    tagThemeDefaults,
    tagsThemeDefaults,
} from '@vuecs/elements';
import {
    formCheckboxGroupThemeDefaults,
    formCheckboxThemeDefaults,
    formGroupThemeDefaults,
    formInputThemeDefaults,
    formNumberThemeDefaults,
    formPinThemeDefaults,
    formRadioGroupThemeDefaults,
    formRadioThemeDefaults,
    formSelectSearchThemeDefaults,
    formSelectThemeDefaults,
    formSliderThemeDefaults,
    formSwitchThemeDefaults,
    formTagsThemeDefaults,
    formTextareaThemeDefaults,
    validationGroupThemeDefaults,
} from '@vuecs/forms';
import { gravatarThemeDefaults } from '@vuecs/gravatar';
import {
    listBodyThemeDefaults,
    listEmptyThemeDefaults,
    listItemThemeDefaults,
    listLoadingThemeDefaults,
    listThemeDefaults,
} from '@vuecs/list';
import {
    breadcrumbItemThemeDefaults,
    breadcrumbSeparatorThemeDefaults,
    breadcrumbThemeDefaults,
    navigationThemeDefaults,
    stepperThemeDefaults,
} from '@vuecs/navigation';
import {
    alertDialogThemeDefaults,
    contextMenuThemeDefaults,
    dropdownMenuThemeDefaults,
    hoverCardThemeDefaults,
    modalThemeDefaults,
    popoverThemeDefaults,
    toastActionThemeDefaults,
    toastDescriptionThemeDefaults,
    toastThemeDefaults,
    toastTitleThemeDefaults,
    toastViewportThemeDefaults,
    tooltipThemeDefaults,
} from '@vuecs/overlays';
import { paginationThemeDefaults } from '@vuecs/pagination';
import {
    placeholderThemeDefaults,
    placeholderWrapperThemeDefaults,
} from '@vuecs/placeholder';
import {
    tableBodyThemeDefaults,
    tableCellThemeDefaults,
    tableEmptyThemeDefaults,
    tableExpandTriggerCellThemeDefaults,
    tableExpandTriggerThemeDefaults,
    tableFooterThemeDefaults,
    tableHeadCellThemeDefaults,
    tableHeaderThemeDefaults,
    tableLoadingThemeDefaults,
    tablePlaceholderThemeDefaults,
    tableRowExpansionThemeDefaults,
    tableRowThemeDefaults,
    tableSortIndicatorsThemeDefaults,
    tableThemeDefaults,
} from '@vuecs/table';
import { timeagoThemeDefaults } from '@vuecs/timeago';
import bulmaTheme from '../../src';

/*
 * Per-theme `auditTheme` coverage probe (plan 015 P5 / plan 024
 * slice 7b catalog expansion).
 *
 * The expected catalog now covers every component package that ships
 * a `*ThemeDefaults` export — 43 components total.
 *
 * `missingElements` + `missingSlots` are suppressed via `skip`: many
 * themes legitimately don't override every component (countdown /
 * timeago have empty defaults; `validationGroup` ships only in
 * theme-tailwind today) or every slot (themes inherit structural
 * `vc-*` defaults for slots they don't visually re-style). The
 * audit's strict view of those categories produces noise without
 * matching signal. `redundantStructural`, `unknownElements`, and
 * `unknownSlots` are enforced — they catch real value-add regressions
 * and typos in theme entries.
 */
const expectedCatalog = {
    alert: alertThemeDefaults,
    alertDescription: alertDescriptionThemeDefaults,
    alertTitle: alertTitleThemeDefaults,
    aspectRatio: aspectRatioThemeDefaults,
    avatar: avatarThemeDefaults,
    badge: badgeThemeDefaults,
    breadcrumb: breadcrumbThemeDefaults,
    breadcrumbItem: breadcrumbItemThemeDefaults,
    breadcrumbSeparator: breadcrumbSeparatorThemeDefaults,
    button: buttonThemeDefaults,
    card: cardThemeDefaults,
    cardBody: cardBodyThemeDefaults,
    cardDescription: cardDescriptionThemeDefaults,
    cardFooter: cardFooterThemeDefaults,
    cardPlaceholder: cardPlaceholderThemeDefaults,
    cardHeader: cardHeaderThemeDefaults,
    cardTitle: cardTitleThemeDefaults,
    collapse: collapseThemeDefaults,
    collapseContent: collapseContentThemeDefaults,
    collapseTrigger: collapseTriggerThemeDefaults,
    contextMenu: contextMenuThemeDefaults,
    countdown: countdownThemeDefaults,
    dropdownMenu: dropdownMenuThemeDefaults,
    formCheckbox: formCheckboxThemeDefaults,
    formCheckboxGroup: formCheckboxGroupThemeDefaults,
    formGroup: formGroupThemeDefaults,
    formInput: formInputThemeDefaults,
    formNumber: formNumberThemeDefaults,
    formPin: formPinThemeDefaults,
    formRadio: formRadioThemeDefaults,
    formRadioGroup: formRadioGroupThemeDefaults,
    formSelect: formSelectThemeDefaults,
    formSelectSearch: formSelectSearchThemeDefaults,
    formSlider: formSliderThemeDefaults,
    formSwitch: formSwitchThemeDefaults,
    formTags: formTagsThemeDefaults,
    formTextarea: formTextareaThemeDefaults,
    gravatar: gravatarThemeDefaults,
    hoverCard: hoverCardThemeDefaults,
    list: listThemeDefaults,
    listBody: listBodyThemeDefaults,
    listEmpty: listEmptyThemeDefaults,
    listItem: listItemThemeDefaults,
    listLoading: listLoadingThemeDefaults,
    alertDialog: alertDialogThemeDefaults,
    modal: modalThemeDefaults,
    navigation: navigationThemeDefaults,
    pagination: paginationThemeDefaults,
    placeholder: placeholderThemeDefaults,
    placeholderWrapper: placeholderWrapperThemeDefaults,
    popover: popoverThemeDefaults,
    separator: separatorThemeDefaults,
    stepper: stepperThemeDefaults,
    table: tableThemeDefaults,
    tableBody: tableBodyThemeDefaults,
    tableCell: tableCellThemeDefaults,
    tableEmpty: tableEmptyThemeDefaults,
    tableFooter: tableFooterThemeDefaults,
    tableHeadCell: tableHeadCellThemeDefaults,
    tableHeader: tableHeaderThemeDefaults,
    tableLoading: tableLoadingThemeDefaults,
    tableExpandTrigger: tableExpandTriggerThemeDefaults,
    tableExpandTriggerCell: tableExpandTriggerCellThemeDefaults,
    tablePlaceholder: tablePlaceholderThemeDefaults,
    tableRow: tableRowThemeDefaults,
    tableRowExpansion: tableRowExpansionThemeDefaults,
    tableSortIndicators: tableSortIndicatorsThemeDefaults,
    tag: tagThemeDefaults,
    tags: tagsThemeDefaults,
    timeago: timeagoThemeDefaults,
    toast: toastThemeDefaults,
    toastAction: toastActionThemeDefaults,
    toastDescription: toastDescriptionThemeDefaults,
    toastTitle: toastTitleThemeDefaults,
    toastViewport: toastViewportThemeDefaults,
    tooltip: tooltipThemeDefaults,
    validationGroup: validationGroupThemeDefaults,
};

const AUDIT_SKIP = ['missingElements', 'missingSlots'] as const;

describe('theme-bulma — auditTheme()', () => {
    it('emits an empty formatted report under the enforced categories', () => {
        const result = auditTheme(bulmaTheme(), expectedCatalog);
        const report = formatAuditResult(result, {
            title: 'theme-bulma',
            skip: [...AUDIT_SKIP],
        });
        expect(report).toBe('');
    });

    it('isAuditClean reflects the un-skipped raw drift', () => {
        // The raw audit may still surface `missingElements` /
        // `missingSlots`. When a theme catches up to full coverage,
        // this assertion starts failing and prompts the suppression
        // to be tightened.
        const result = auditTheme(bulmaTheme(), expectedCatalog);
        expect(isAuditClean(result)).toBe(false);
    });
});
