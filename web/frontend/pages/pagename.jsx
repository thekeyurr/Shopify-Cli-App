import React, {useState, useCallback} from "react";
import { ButtonGroup, Button, Select } from "@shopify/polaris";

import { useForm, useField } from "@shopify/react-form";
import { CurrencyCode } from "@shopify/react-i18n";

import metafields from "./metafields";

import {
  ActiveDatesCard,
  CombinationCard,
  DiscountClass,
  DiscountMethod,
  MethodCard,
  DiscountStatus,
  RequirementType,
  SummaryCard,
  UsageLimitsCard,
  onBreadcrumbAction,
} from "@shopify/discount-app-components";

import {
  Banner,
  Card,
  Layout,
  Page,
  TextField,
  Stack,
  PageActions,
  ChoiceList,
  Modal,
  List,
  Checkbox,
} from "@shopify/polaris";

import { useAppBridge } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";

const FUNCTION_ID = "01GJ2V7NVEMC02VKBHEVYT364G";








export default function Discount() {
    const fetch = useAuthenticatedFetch();



    const {
      fields: {
        configuration,
      },
            submit,
            submitting,
            dirty,

    } = useForm({
      fields: {
        configuration: {
          quantity: useField("1"),
          percentage: useField(""),
          value: useField(""),
          selectOption: useField("  "),
          
        }
      },

      onSubmit: async form => {
        console.log(form, "Form data");
        const discount = {
          functionId: FUNCTION_ID,
          combinesWith: form.combinesWith,
          startsAt: form.startDate,
          endsAt: form.endDate,
          metafields: [
            {
              namespace: metafields.namespace,
              key: metafields.key,
              type: "json",
              value: JSON.stringify({
                quantity: parseInt(form.configuration.quantity),
                percentage: parseFloat(form.configuration.percentage),
              }),
            },
          ],
        };
    }});
    

    // demo
    const selectOptions = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];

    const handleSelectChange = (newValue) => {
      let demo = configuration.selectOption = newValue;
      console.log("demo=======", demo);
    };
    

    
    
    // select input one
    const [selected, setSelected] = useState('');
    
    const optionsPropety = [
      {label: 'Select Property', value: 'select Property'},
      {label: 'Cart Property', value: 'cart property'}
    ];
    const handleSelectCart = useCallback(
      (value) => {
          setSelected(value);
          setDirty(true);
        },
      []
    );
  
    
    // select input two

    const [selectCondition, setConditon] = useState('')
    
    const ConditionOption = [
      { label: 'Select Condition', value: 'select Condition' },
      { label: 'Is equal to', value: 'is equal to' },
    ];


    const handleSelectCondition = useCallback(
      (value)=> setConditon(value),
    )

  return (
    <Page
       title="Create Discount Page"

       primaryAction={{
        content: "Save",
        onAction: submit,
        disabled: !dirty,
        loading: submitting 
       }}
    >
    <Layout>
        <Layout.Section>
          <form onSubmit={submit}>
            <Card title="Value">
                <Card.Section>
                <Stack>
                  <Select
                    options={optionsPropety}
                    onChange={handleSelectCart}
                    value={selected}
                  /> 
                  <Select                  
                    options={ConditionOption}
                    onChange={handleSelectCondition}
                    value={selectCondition}
                  />
                    <Select
      label="Select Option"
      options={selectOptions}
      value={configuration.selectOption.value}
      onChange={handleSelectChange}
    />
                  <TextField
                          {...configuration.percentage}
                          placeholder="Property Name..."
                  />
                  <TextField
                          {...configuration.value}
                          prefix="$"
                          placeholder="0.00"
                  />
                </Stack>                
                </Card.Section>
            </Card>
          </form>
        </Layout.Section>
        <Layout.Section>
          <PageActions
              primaryAction={{
                content: "Save discount",
                onAction: submit,
                disabled: !dirty,
                loading: submitting,
              }}
              secondaryActions={[
                {
                  content: "Discard",
                  onAction: () => onBreadcrumbAction(redirect, true),
                },
              ]}
            />
        </Layout.Section>
      </Layout> 
    </Page>
  );
}







